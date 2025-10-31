import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { dataSourceOptions } from './database/config/data-source';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({...dataSourceOptions, autoLoadEntities: true}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}