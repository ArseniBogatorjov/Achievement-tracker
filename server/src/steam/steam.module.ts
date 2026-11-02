import { Module } from '@nestjs/common';
import { SteamService } from './steam.service';
import { SteamController } from './steam.controller';
import { ScavengerService } from '../scavenger/scavenger.service';
import { SteamApiService } from './steam-api.service';
import { SteamSyncService } from './steam-sync.service';

@Module({
  controllers: [SteamController],
  providers: [
    SteamService,
    ScavengerService,
    SteamApiService,
    SteamSyncService,
  ],
})
export class SteamModule {}
