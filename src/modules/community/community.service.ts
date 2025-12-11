import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Community, CommunityDocument } from './model/community.model';
import { Connection, Model } from 'mongoose';
import {
  CommunityMember,
  CommunityMemberDocument,
} from './model/community-member.model';
import { UserDetails } from 'src/helper/interface';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CreateCommunityResponseDto } from './interface/create-community.interface';
import { User, UserDocument } from '../users/model/users.model';
import { ErrorMessages, ErrorType } from 'src/helper';
import { LookupsService } from '../lookups/lookups.service';
import { Lookup, LookupDetails } from 'src/helper/enum';
import { Category, CategoryDocument } from '../lookups/model/categories.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>,

    @InjectModel(CommunityMember.name)
    private communityMemberModel: Model<CommunityMemberDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly lookupService: LookupsService,
  ) {}

  async createCommunity(
    user: UserDetails,
    dto: CreateCommunityDto,
  ): Promise<CreateCommunityResponseDto> {
    const userId = user.id;

    const isUserExists = await this.userModel.findById(userId);

    if (!isUserExists) {
      throw new BadRequestException({
        error: ErrorType.Auth.UserNotFound,
        message: ErrorMessages[ErrorType.Auth.UserNotFound],
      });
    }

    const lookupDetail = await this.lookupService.getLookupDetailByCodes(
      Lookup.ACCOUNT_STATUS,
      LookupDetails.ACTIVE,
    );

    const ownerLookupDetail = await this.lookupService.getLookupDetailByCodes(Lookup.ROLE, LookupDetails.OWNER);

    if (lookupDetail.lookup_detail.id !== isUserExists.status_id.toString()) {
      throw new BadRequestException({
        error: ErrorType.Auth.AccountNotActive,
        message: ErrorMessages[ErrorType.Auth.AccountNotActive],
      });
    }

    const isCommunityExists = await this.communityModel.findOne({
      name: dto.name,
    });

    if (isCommunityExists) {
      throw new BadRequestException({
        error: ErrorType.Community.CommunityAlreadyExists,
        message: ErrorMessages[ErrorType.Community.CommunityAlreadyExists],
      });
    }

    const isInterestExists = await this.categoryModel.findOne({
      name: dto.category,
    });
    if (!isInterestExists) {
      throw new BadRequestException({
        error: ErrorType.Community.CategoryNotFound,
        message: ErrorMessages[ErrorType.Community.CategoryNotFound],
      });
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const createdCommunities = await this.communityModel.create(
        [
          {
            name: dto.name,
            subTitle: dto.subTitle,
            description: dto.description ?? null,
            category_id: isInterestExists._id,
          },
        ],
        { session },
      );

      const community = createdCommunities[0];

      // 7️⃣ Add user as OWNER in community_member table
      await this.communityMemberModel.create(
        [
          {
            user_id: isUserExists._id,
            community_id: community._id,
            role_id: ownerLookupDetail.lookup_detail.id,
            joined_at: new Date()
          },
        ],
        { session },
      );

      await session.commitTransaction();

      return {
        name: community.name,
        subTitle: community.subTitle,
        description: community.description ?? '',
        category: isInterestExists.name,
        owner: {
          user_id: (isUserExists._id as ObjectId).toHexString(),
          username: isUserExists.username,
        },
        created_at: new Date(),
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
