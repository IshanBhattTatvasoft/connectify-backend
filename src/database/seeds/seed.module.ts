import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/modules/lookups/model/categories.model';
import { Lookup, LookupSchema } from 'src/modules/lookups/model/lookup.model';
import { LookupDetail, LookupDetailSchema } from 'src/modules/lookups/model/lookup_details.model';
import { LookupSeeder } from './lookup.seeder';
import { CategorySeeder } from './category.seeder';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    MongooseModule.forFeature([
      { name: Lookup.name, schema: LookupSchema },
      { name: LookupDetail.name, schema: LookupDetailSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [LookupSeeder, CategorySeeder],
  exports: [LookupSeeder, CategorySeeder],
})
export class SeedsModule {}
