import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { SteamAchievement, SteamGame } from './types/steam-api.responses';
import { ProgressCalculationObject } from './types/steam.types';
import { setTimeout as sleep } from 'timers/promises';
import { PrismaService } from '../prisma/prisma.service';
import { SteamApiService } from './steam-api.service';
import { ScavengerService } from '../scavenger/scavenger.service';

@Injectable()
export class SteamSyncService {
  private readonly logger = new Logger(SteamSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly steamApiService: SteamApiService,
    private readonly scavengerService: ScavengerService,
  ) {}

  private async saveGameAchievements(
    gameId: string,
    appId: number,
    achievements: SteamAchievement[],
  ): Promise<number> {
    try {
      const globalPercentagesData =
        await this.steamApiService.fetchGlobalAchievementPercentages(appId);

      const rarityMap = new Map<string, number>();
      const globalList =
        globalPercentagesData?.achievementpercentages?.achievements;

      if (globalList) {
        for (const item of globalList) {
          rarityMap.set(item.name, Number(item.percent));
        }
      }

      await this.prisma.achievement.createMany({
        data: achievements.map((achievement) => ({
          gameId,
          apiname: achievement.name,
          name: achievement.displayName,
          description: achievement.description || null,
          iconUrl: achievement.icon,
          globalRarity: rarityMap.get(achievement.name) ?? null,
        })),
        skipDuplicates: true,
      });

      return achievements.length;
    } catch (error) {
      this.logger.error(
        `Failed to save achievements for gameId ${gameId} (appId: ${appId}): ${error}`,
      );
      throw error;
    }
  }

  private async saveUserAchievements(
    userId: string,
    steamId: string,
    gameId: string,
    appId: number,
  ): Promise<number> {
    try {
      const playerAchievementsData =
        await this.steamApiService.fetchUserAchievements(steamId, appId);

      if (!playerAchievementsData) return 0;

      const unlockedAchievements =
        playerAchievementsData.playerstats?.achievements?.filter(
          (achievement) => achievement.achieved === 1,
        );

      if (!unlockedAchievements || unlockedAchievements.length === 0) return 0;

      const achievementApiNames = unlockedAchievements.map(
        (achievement) => achievement.apiname,
      );

      const dbAchievements = await this.prisma.achievement.findMany({
        where: {
          gameId,
          apiname: { in: achievementApiNames },
        },
        select: {
          id: true,
          apiname: true,
        },
      });

      const achievementMap = new Map(
        dbAchievements.map((achievement) => [
          achievement.apiname,
          achievement.id,
        ]),
      );

      const validUnlockedAchievements = unlockedAchievements.filter(
        (achievement) => achievementMap.has(achievement.apiname),
      );

      const userAchievementsToCreate = validUnlockedAchievements.map(
        (achievement) => ({
          userId,
          achievementId: achievementMap.get(achievement.apiname)!,
          unlockedAt: new Date(achievement.unlocktime * 1000),
        }),
      );

      if (userAchievementsToCreate.length > 0) {
        await this.prisma.userAchievement.createMany({
          data: userAchievementsToCreate,
          skipDuplicates: true,
        });
      }

      return userAchievementsToCreate.length;
    } catch (error) {
      this.logger.error(
        `Failed to save achievements for user ${userId}: ${error}`,
      );
      throw error;
    }
  }

  private async syncSingleGame(
    game: SteamGame,
    userId: string,
    steamId: string,
    existingGamesMap: Map<number, string>,
  ): Promise<void> {
    try {
      const gameSchema = await this.steamApiService.fetchGameSchema(game.appid);
      const achievements = gameSchema?.game?.availableGameStats?.achievements;

      if (!achievements || achievements.length === 0) {
        return;
      }

      let gameId = existingGamesMap.get(game.appid);

      if (!gameId) {
        const savedGame = await this.prisma.game.upsert({
          where: { steamAppId: game.appid },
          update: { name: game.name },
          create: {
            steamAppId: game.appid,
            name: game.name,
            coverUrl: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`,
          },
        });

        gameId = savedGame.id;
      }

      const totalAchievements = await this.saveGameAchievements(
        gameId,
        game.appid,
        achievements,
      );

      await this.scavengerService.updateMissableAchievements(
        gameId,
        game.appid,
      );

      const unlockedAchievements = await this.saveUserAchievements(
        userId,
        steamId,
        gameId,
        game.appid,
      );

      let progressObject: ProgressCalculationObject = {
        completionPercent: 0,
        status: 'backlog',
      };

      if (totalAchievements > 0) {
        const progress =
          Math.round((unlockedAchievements / totalAchievements) * 100 * 10) /
          10;

        if (progress === 100) {
          progressObject = {
            completionPercent: progress,
            status: 'completed',
          };
        } else if (progress > 0) {
          progressObject = {
            completionPercent: progress,
            status: 'playing',
          };
        }
      }

      const lastPlayed = game.rtime_last_played
        ? new Date(game.rtime_last_played * 1000)
        : null;

      await this.prisma.userGame.upsert({
        where: {
          userId_gameId: {
            userId,
            gameId,
          },
        },
        update: {
          playtimeMinutes: game.playtime_forever,
          lastPlayedAt: lastPlayed,
          completionPercent: progressObject.completionPercent,
          status: progressObject.status,
        },
        create: {
          userId,
          gameId,
          playtimeMinutes: game.playtime_forever,
          lastPlayedAt: lastPlayed,
          completionPercent: progressObject.completionPercent,
          status: progressObject.status,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to sync single game appId ${game.appid} for user ${userId}: ${error}`,
      );
    }
  }

  public async syncUserGames(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (!user.steamId) {
      throw new BadRequestException('Current user does not have steamId');
    }

    const steamId = user.steamId;

    try {
      await this.steamApiService.validateSteamId(steamId);

      const steamResponse = await this.steamApiService.fetchUserGames(steamId);

      const games = steamResponse?.response?.games;

      if (!games) {
        throw new BadRequestException('Unable to retrieve games from Steam');
      }

      const filteredGames = games.filter((game) => game.playtime_forever > 0);

      const existingGames = await this.prisma.game.findMany({
        where: {
          steamAppId: { in: filteredGames.map((game) => game.appid) },
        },
        select: { id: true, steamAppId: true },
      });

      const existingGamesMap = new Map<number, string>(
        existingGames.map((game) => [game.steamAppId, game.id]),
      );

      const gameChunks: SteamGame[][] = [];

      for (let i = 0; i < filteredGames.length; i += 3) {
        gameChunks.push(filteredGames.slice(i, i + 3));
      }

      for (const chunk of gameChunks) {
        await sleep(500);
        await Promise.all(
          chunk.map((game) =>
            this.syncSingleGame(game, userId, steamId, existingGamesMap),
          ),
        );
      }
    } catch (error) {
      this.logger.error(`User sync failed for userId ${userId}:`, error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Steam synchronization failed');
    }
  }
}
