import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Community, CommunitySchema } from './model/community.model';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { CommunityMember, CommunityMemberSchema } from './model/community-member.model';
import { User, UserSchema } from '../users/model/users.model';
import { Category, CategorySchema } from '../lookups/model/categories.model';
import { LookupsService } from '../lookups/lookups.service';
import { Lookup, LookupSchema } from '../lookups/model/lookup.model';
import { LookupDetail, LookupDetailSchema } from '../lookups/model/lookup_details.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Community.name, schema: CommunitySchema },
      { name: CommunityMember.name, schema: CommunityMemberSchema},
      { name: User.name, schema: UserSchema},
      { name: Category.name, schema: CategorySchema},
      { name: Lookup.name, schema: LookupSchema},
      { name: LookupDetail.name, schema: LookupDetailSchema}
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService, LookupsService],
  exports: [CommunityService]
})
export class CommunityModule {}
