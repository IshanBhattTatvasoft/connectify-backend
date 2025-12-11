import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lookup, LookupSchema } from './model/lookup.model';
import { LookupDetail, LookupDetailSchema } from './model/lookup_details.model';
import { LookupsService } from './lookups.service';
import { LookupsController } from './lookups.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lookup.name, schema: LookupSchema },
      { name: LookupDetail.name, schema: LookupDetailSchema },
    ]),
  ],
  controllers: [LookupsController],
  providers: [LookupsService],
  exports: [LookupsService],
})
export class LookupsModule {}
