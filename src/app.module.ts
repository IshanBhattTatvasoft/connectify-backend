import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { LookupsModule } from './modules/lookups/lookups.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LookupSeeder } from './database/seeds/lookup.seeder';
import { CategorySeeder } from './database/seeds/category.seeder';
import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { CommunityModule } from './modules/community/community.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 This makes process.env available everywhere
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI!),
    LookupsModule,
    AuthModule,
    CommunityModule,
  ],
  controllers: [],
  providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
],
  exports: [],
})
export class AppModule {}
