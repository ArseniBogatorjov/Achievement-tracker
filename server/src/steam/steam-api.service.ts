import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type {
  SteamGameSchemaResponse,
  SteamGetOwnedGamesResponse,
  SteamGlobalAchievementsResponse,
  SteamPlayerAchievementsResponse,
  SteamPlayerSummariesResponse,
} from './types/steam-api.responses';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SteamApiService {
  private readonly logger = new Logger(SteamApiService.name);
  private readonly STEAM_API_KEY: string;

  constructor(private readonly configService: ConfigService) {
    this.STEAM_API_KEY = configService.getOrThrow<string>('STEAM_API_KEY');
  }

  public async fetchUserGames(
    steamId: string,
  ): Promise<SteamGetOwnedGamesResponse | null> {
    try {
      const url = new URL(
        'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('steamid', steamId);
      url.searchParams.append('include_appinfo', 'true');

      const response = await fetch(url);

      if (!response.ok) {
        this.logger.error(`Steam API returned status: ${response.status}`);
        return null;
      }

      return (await response.json()) as SteamGetOwnedGamesResponse;
    } catch (error) {
      this.logger.error(
        `Error fetching user games for SteamID ${steamId}: ${error}`,
      );
      return null;
    }
  }

  public async fetchGameSchema(
    appId: number,
  ): Promise<SteamGameSchemaResponse | null> {
    try {
      const url = new URL(
        'http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('appid', appId.toString());

      const response = await fetch(url);

      if (!response.ok) return null;

      return (await response.json()) as SteamGameSchemaResponse;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch game schema for appId ${appId}: ${error}`,
      );
      return null;
    }
  }

  public async fetchGlobalAchievementPercentages(
    appId: number,
  ): Promise<SteamGlobalAchievementsResponse | null> {
    try {
      const url = new URL(
        'http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/',
      );

      url.searchParams.append('gameid', appId.toString());

      const response = await fetch(url);

      if (!response.ok) return null;

      return (await response.json()) as SteamGlobalAchievementsResponse;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch global percentages for appId ${appId}: ${error}`,
      );
      return null;
    }
  }

  public async fetchUserAchievements(
    steamId: string,
    appId: number,
  ): Promise<SteamPlayerAchievementsResponse | null> {
    try {
      const url = new URL(
        'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/',
      );

      url.searchParams.append('key', this.STEAM_API_KEY);
      url.searchParams.append('steamid', steamId);
      url.searchParams.append('appid', appId.toString());

      const response = await fetch(url);

      if (!response.ok) return null;

      return (await response.json()) as SteamPlayerAchievementsResponse;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch player achievements for appId ${appId}: ${error}`,
      );
      return null;
    }
  }

  public async validateSteamId(steamId: string): Promise<void> {
    const url = new URL(
      'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/',
    );

    url.searchParams.append('key', this.STEAM_API_KEY);
    url.searchParams.append('steamids', steamId);

    const response = await fetch(url);

    if (!response.ok) {
      throw new BadRequestException('Failed to validate Steam account');
    }

    const data = (await response.json()) as SteamPlayerSummariesResponse;

    const player = data.response?.players?.find(
      (player) => player.steamid === steamId,
    );

    if (!player) {
      throw new BadRequestException('Steam account not found');
    }
  }
}
