import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { SteamModule } from './steam/steam.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ScavengerModule } from './scavenger/scavenger.module';
import { SteamApiService } from './steam-api/steam-api.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SteamModule,
    DashboardModule,
    ScavengerModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, SteamApiService],
})
export class AppModule {}
