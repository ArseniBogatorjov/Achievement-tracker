import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveSteamDto } from './dto/sync-steam-id.dto';
import { SteamApiService } from './steam-api.service';

@Injectable()
export class SteamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly steamApiService: SteamApiService,
  ) {}

  public async saveSteamId(userId: string, dto: SaveSteamDto): Promise<void> {
    const { steamId } = dto;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.steamId === steamId) {
      throw new ConflictException('This Steam ID is already connected');
    }

    await this.steamApiService.validateSteamId(steamId);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        steamId,
      },
    });
  }
}
