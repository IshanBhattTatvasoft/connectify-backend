import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { LookupsModule } from './modules/lookups/lookups.module';
import { AuthModule } from './modules/auth/auth.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    LookupsModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}