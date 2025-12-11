import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/login-user.dto';
import { SignupUserDTO } from './dto/signup-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User, UserDocument } from '../users/model/users.model';
import { AuthenticatedUser } from './interfaces/auth-user.interface';
import {
  ErrorMessages,
  ErrorType,
  generateToken,
  handleGoogleAuthFlow,
  Mailer,
} from 'src/helper';
import { OAuth2Client } from 'google-auth-library';
import {
  generateOtp,
  getDateAndTime,
  hashOtp,
  verifyOtpHash,
} from 'src/helper/utils';
import { ObjectId } from 'mongodb';
import { ResetPasswordDto } from './dto/forgot-password.dto';
import {
  LookupDetail,
  LookupDetailDocument,
} from '../lookups/model/lookup_details.model';
import { UserDetails } from 'src/helper/interface';
import {
  CommunityMember,
  CommunityMemberDocument,
} from '../community/model/community-member.model';
import {
  GetProfileResponseDto,
  UpdateProfileDto,
  UpdateProfileResponseDto,
} from './dto/user-profile.dto';
import {
  Community,
  CommunityDocument,
} from '../community/model/community.model';
import { LookupsService } from '../lookups/lookups.service';
import { Lookup, LookupDetails } from 'src/helper/enum';

@Injectable()
export class AuthService {
  private oauthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/api/auth/google/callback',
  );

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(LookupDetail.name)
    private lookupDetailModel: Model<LookupDetailDocument>,
    private readonly jwtService: JwtService,
    private lookupService: LookupsService,
  ) {}

  async login(
    dto: LoginUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (dto.id_token) {
      return handleGoogleAuthFlow(
        dto.id_token,
        this.userModel,
        this.lookupDetailModel,
        this.jwtService,
      );
    }
    

    if (!dto.email || !dto.password) {
      throw new UnauthorizedException({
        error: ErrorType.Auth.EmailPasswordRequired,
        message: ErrorMessages[ErrorType.EmailPasswordRequired],
      });
    }

    const lowerEmail = dto.email.trim().toLowerCase();

    const existing = await this.userModel.findOne({ email: lowerEmail });
    if (!existing) {
      throw new UnauthorizedException({
        error: ErrorType.Auth.UserNotFound,
        messages: ErrorMessages[ErrorType.UserNotFound],
      });
    }

    const lookupDetail = await this.lookupService.getLookupDetailByCodes(
      Lookup.ACCOUNT_STATUS,
      LookupDetails.ACTIVE,
    );

    if (existing.status_id.toString() !== lookupDetail.lookup_detail.id) {
      throw new BadRequestException({
        error: ErrorType.Auth.AccountNotActive,
        message: ErrorMessages[ErrorType.Auth.AccountNotActive],
      });
    }

    if (existing.provider_id !== 'google' && existing.password_hash) {
      const isPasswordValid = await bcrypt.compare(
        dto.password,
        existing.password_hash,
      );
      if (!isPasswordValid)
        throw new BadRequestException('Invalid credentials');
    }

    return generateToken(existing, 'ACTIVE', this.jwtService);
  }

  async signUp(
    dto: SignupUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (dto.id_token) {
      return handleGoogleAuthFlow(
        dto.id_token,
        this.userModel,
        this.lookupDetailModel,
        this.jwtService,
      );
    }

    if (!dto.email || !dto.password) {
      throw new BadRequestException({
        error: ErrorType.Auth.EmailPasswordRequired,
        message: ErrorMessages[ErrorType.EmailPasswordRequired],
      });
    }

    const existing = await this.userModel.findOne({ email: dto.email });
    if (!existing) {
      throw new BadRequestException({
        error: ErrorType.Common.Conflict,
        message: ErrorMessages[ErrorType.Conflict],
      });
    }
    const lookupDetail = await this.lookupService.getLookupDetailByCodes(
      Lookup.ACCOUNT_STATUS,
      LookupDetails.ACTIVE,
    );

    if (existing.status_id.toString() !== lookupDetail.lookup_detail.id) {
      throw new BadRequestException({
        error: ErrorType.Auth.AccountNotActive,
        message: ErrorMessages[ErrorType.Auth.AccountNotActive],
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);

    const username = dto.email.split('@')[0];

    const newUser = new this.userModel({
      username: username,
      email: dto.email,
      password_hash: hash,
      status_id: existing?.status_id,
    });

    const savedUser = await newUser.save();

    return generateToken(savedUser, 'ACTIVE', this.jwtService);
  }

  async handleGoogleCallback(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    console.log('code::: ', code);
    let userStatus = '';

    const { tokens } = await this.oauthClient.getToken(code);
    if (!tokens.id_token) {
      throw new BadRequestException('No ID token returned from Google');
    }

    const ticket = await this.oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new BadRequestException('Invalid Google user');
    }

    let user = await this.userModel.findOne({ email: payload.email });
    const lookupDetail = await this.lookupService.getLookupDetailByCodes(
      Lookup.ACCOUNT_STATUS,
      LookupDetails.ACTIVE,
    );

    if (user && user.status_id.toString() !== lookupDetail.lookup_detail.id) {
      throw new BadRequestException({
        error: ErrorType.Auth.AccountNotActive,
        message: ErrorMessages[ErrorType.Auth.AccountNotActive],
      });
    }

    if (!user) {
      user = new this.userModel({
        username: payload.email.split('@')[0],
        email: payload.email,
        provider: 'google',
        provider_id: payload.sub,
        name: payload.name,
        status_id: lookupDetail.lookup_detail.id,
      });

      await user.save();
    } else {
      let lookupDetail = await this.lookupDetailModel.findOne({
        id: user.status_id,
      });
      if (lookupDetail && lookupDetail.code) userStatus = lookupDetail?.code;
    }

    const { accessToken, refreshToken } = await generateToken(
      user,
      userStatus,
      this.jwtService,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async sendOtp(email: string): Promise<void> {
    const lowerEmail = email.toLowerCase();
    const user = await this.userModel.findOne({ email: lowerEmail });
    console.log('user::: ', user);
    if (!user) return;

    const lookupDetail = await this.lookupService.getLookupDetailByCodes(Lookup.ACCOUNT_STATUS, LookupDetails.ACTIVE);

    if (user.status_id.toString() !== lookupDetail.lookup_detail.id) {
      throw new BadRequestException({
        error: ErrorType.Auth.AccountNotActive,
        message: ErrorMessages[ErrorType.Auth.AccountNotActive],
      });
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    // Expiry (5 min)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save to DB
    user.otp = otpHash;
    user.otp_expiration_time = expiresAt;
    user.is_reset_token_used = false;

    await user.save();
    console.log(`Generated OTP for ${email}: ${otp}`);

    // await this.sendVerificationEmail(existingUser, existingUser.email, otpGenerated, `${otpTimeout} minutes`);
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ verified: boolean; token?: string }> {
    const lowerEmail = email.toLowerCase();
    const user = await this.userModel.findOne({ email: lowerEmail });

    if (!user) {
      throw new BadRequestException({
        error: ErrorType.Auth.UserNotFound,
        messages: ErrorMessages[ErrorType.UserNotFound],
      });
    }

    if (
      !user.otp ||
      (user.otp_expiration_time && new Date() > user.otp_expiration_time)
    ) {
      throw new BadRequestException({
        error: ErrorType.Auth.ExpiredOtp,
        message: ErrorMessages[ErrorType.ExpiredOtp],
      });
    }

    console.log('otp::: ', otp);
    console.log('user.otp::: ', user.otp);

    const isValid = verifyOtpHash(otp, user.otp);
    if (!isValid) {
      throw new BadRequestException({
        error: ErrorType.Auth.InvalidOtp,
        message: ErrorMessages[ErrorType.InvalidOtp],
      });
    }

    const idAsString = (user._id as ObjectId).toString();
    const payload: Record<string, any> = {
      sub: idAsString,
      purpose: 'password_reset',
      email: user.email,
      username: user.username,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '10min' });

    user.otp = undefined;
    user.otp_expiration_time = undefined;
    user.is_reset_token_used = false;

    await user.save();

    return { verified: true, token };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    let payload: any;
    const { token, password } = resetPasswordDto;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException({
        error: ErrorType.Auth.InvalidToken,
        message: ErrorMessages[ErrorType.InvalidToken],
      });
    }

    console.log('payload::: ', payload);

    if (payload.purpose !== 'password_reset') {
      throw new UnauthorizedException('Invalid token purpose');
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user) throw new NotFoundException('User not found');

    if (user.is_reset_token_used) {
      throw new BadRequestException('Token already used');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password_hash = hash;
    user.is_reset_token_used = true;
    await user.save();
  }

  async getProfileDetails(user: UserDetails): Promise<GetProfileResponseDto> {
    const userId = user.id;

    const existingUser = await this.userModel.findById(userId);

    if(!existingUser){
      throw new BadRequestException({
        error: ErrorType.Auth.UserNotFound,
        message: ErrorMessages[ErrorType.Auth.UserNotFound]
      });
    }

    const lookupDetail = await this.lookupService.getLookupDetailByCodes(Lookup.ACCOUNT_STATUS, LookupDetails.ACTIVE);

    if (existingUser.status_id.toString() !== lookupDetail.lookup_detail.id) {
      throw new BadRequestException({
        error: ErrorType.Auth.AccountNotActive,
        message: ErrorMessages[ErrorType.Auth.AccountNotActive],
      });
    }

    // Single aggregation query → gets user + all community names in ONE DB call
    const result = await this.userModel
      .aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'community_member', // ← exact collection name in MongoDB
            localField: '_id',
            foreignField: 'user_id',
            as: 'memberships',
          },
        },
        {
          $unwind: { path: '$memberships', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'communities', // ← exact collection name
            localField: 'memberships.community_id',
            foreignField: '_id',
            as: 'memberships.community',
          },
        },
        {
          $group: {
            _id: '$_id',
            username: { $first: '$username' },
            email: { $first: '$email' },
            mobile_no: { $first: '$mobile_no' },
            address: { $first: '$address' },
            created_at: { $first: '$created_at' },
            communityNames: {
              $push: {
                $cond: [
                  { $ifNull: ['$memberships.community.name', false] },
                  '$memberships.community.name',
                  '$$REMOVE',
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            username: 1,
            email: 1,
            password_hash: 0,
            otp: 0,
            otp_expiration_time: 0,
            mobile_no: { $ifNull: ['$mobile_no', undefined] },
            address: { $ifNull: ['$address', undefined] },
            created_date: '$created_at',
            communities: '$communityNames',
          },
        },
      ])
      .exec();

    if (!result || result.length === 0) {
      throw new UnauthorizedException({
        error: ErrorType.Auth.UserNotFound,
        message: ErrorMessages[ErrorType.UserNotFound],
      });
    }

    return result[0] as GetProfileResponseDto;
  }

  async updateProfileDetails(
    user: UserDetails,
    dto: UpdateProfileDto,
  ): Promise<UpdateProfileResponseDto> {
    const userId = user.id;

    const existingUser = await this.userModel.findById(userId);

    if(!existingUser){
      throw new BadRequestException({
        error: ErrorType.Auth.UserNotFound,
        message: ErrorMessages[ErrorType.Auth.UserNotFound]
      });
    }

    const lookupDetail = await this.lookupService.getLookupDetailByCodes(Lookup.ACCOUNT_STATUS, LookupDetails.ACTIVE);

    if (existingUser.status_id.toString() !== lookupDetail.lookup_detail.id) {
      throw new BadRequestException({
        error: ErrorType.Auth.AccountNotActive,
        message: ErrorMessages[ErrorType.Auth.AccountNotActive],
      });
    }

    if (
      (dto.mobile_number && dto.mobile_number?.trim() == '') ||
      typeof dto.mobile_number !== 'string'
    ) {
      throw new BadRequestException({
        error: ErrorType.Common.InvalidMobileNumber,
        message: ErrorMessages[ErrorType.Common.InvalidMobileNumber],
      });
    }

    if (
      (dto.address && dto.address.trim() == '') ||
      typeof dto.address !== 'string'
    ) {
      throw new BadRequestException({
        error: ErrorType.Common.InvalidAddress,
        message: ErrorMessages[ErrorType.Common.InvalidAddress],
      });
    }

    if (dto.mobile_number) dto.mobile_number = dto.mobile_number.trim();
    if (dto.address) dto.address = dto.address.trim();

    const updatedData = {
      ...(dto.mobile_number !== undefined && {
        mobile_no: dto.mobile_number || null,
      }),
      ...(dto.address !== undefined && { address: dto.address || null }),
    };

    if (existingUser && Object.keys(updatedData).length === 0)
      return {
        username: existingUser.username,
        email: existingUser.email,
        address: existingUser.address,
        mobile_no: existingUser.mobile_no,
      };

    // new: tells whether the method returns the modified document or the original document before the update
    // Set new: true means the application returns the updated state of the document after the operation
    // runValidators: option ensures that Mongoose schema validators are executed during an update operation
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $set: updatedData },
        { new: true, runValidators: true },
      )
      .select('username email mobile_no address');

    if (!updatedUser) {
      throw new NotFoundException({
        error: ErrorType.Auth.UserNotFound,
        message: ErrorMessages[ErrorType.UserNotFound],
      });
    }

    return updatedUser;
  }
}
