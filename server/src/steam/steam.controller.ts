import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SteamService } from './steam.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatusResponseDto } from '../auth/dto/status-response.dto';
import { SaveSteamDto } from './dto/sync-steam-id.dto';
import { SteamSyncService } from './steam-sync.service';

@Controller('steam')
export class SteamController {
  private readonly logger = new Logger(SteamController.name);

  constructor(
    private readonly steamService: SteamService,
    private readonly steamSyncService: SteamSyncService,
  ) {}

  @ApiOperation({
    summary: 'Get user steam data',
    description: 'Retrieves user games and achievements from steam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusResponseDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('sync')
  syncUserGames(@CurrentUser() user: User) {
    this.steamSyncService
      .syncUserGames(user.id)
      .catch((error) => this.logger.error(error));
    return { message: 'synchronization started' };
  }

  @ApiOperation({
    summary: 'Update user steam id',
    description: 'Updates current user steam id by user id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'This Steam ID is already connected',
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch('save')
  async saveSteamId(@CurrentUser() user: User, @Body() dto: SaveSteamDto) {
    await this.steamService.saveSteamId(user.id, dto);
    return { status: 'success' };
  }
}
