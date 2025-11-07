import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lookup, LookupSchema } from './model/lookup.model';
import { LookupDetail, LookupDetailsSchema } from './model/lookup_details.model';
import { LookupsService } from './lookups.service';
import { LookupsController } from './lookups.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lookup.name, schema: LookupSchema },
      { name: LookupDetail.name, schema: LookupDetailsSchema },
    ]),
  ],
  controllers: [LookupsController],
  providers: [LookupsService],
  exports: [LookupsService],
})
export class LookupsModule {}
