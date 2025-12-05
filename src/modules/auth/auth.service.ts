import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  ) {}

  async login(
    dto: LoginUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log('dto::: ', dto);
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
        message: ErrorMessages[ErrorType.EmailPasswordRequired]
      });
    }

    const lowerEmail = dto.email.trim().toLowerCase();

    const existing = await this.userModel.findOne({ email: lowerEmail });
    console.log('existing::: ', existing);
    if (!existing) {
      throw new UnauthorizedException({
        error: ErrorType.Auth.UserNotFound,
        messages: ErrorMessages[ErrorType.UserNotFound]
      });
    }

    let userStatus = await this.lookupDetailModel.findOne({
      id: existing.status_id,
    });
    if (!userStatus || userStatus.code !== 'ACTIVE') {
      throw new BadRequestException('User not active');
    }

    if (existing.provider_id !== 'google' && existing.password_hash) {
      const isPasswordValid = await bcrypt.compare(
        dto.password,
        existing.password_hash,
      );
      if (!isPasswordValid)
        throw new BadRequestException('Invalid credentials');
    }

    return generateToken(existing[0], 'ACTIVE', this.jwtService);
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
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new BadRequestException('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);
    const username = dto.email.split('@')[0];
    const newUser = new this.userModel({
      username: username,
      email: dto.email,
      password_hash: hash,
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
    let userStatus = '';

    if (!user) {
      user = new this.userModel({
        username: payload.email.split('@')[0],
        email: payload.email,
        provider: 'google',
        provider_id: payload.sub,
        name: payload.name,
        status: {
          name: 'active',
          code: 'ACTIVE',
        },
      });
      userStatus = 'ACTIVE';

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

    const userStatus = await this.lookupDetailModel.findOne({
      id: user?.status_id,
    });

    if (!userStatus?.code || userStatus?.code !== 'ACTIVE') {
      throw new BadRequestException({
        error: ErrorType.AccountNotActive,
        message: ErrorMessages[ErrorType.AccountNotActive],
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

    if (!user || !user.otp || !user.otp_expiration_time) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (new Date() > user.otp_expiration_time) {
      throw new BadRequestException('OTP expired');
    }

    console.log('otp::: ', otp);
    console.log('user.otp::: ', user.otp);

    const isValid = verifyOtpHash(otp, user.otp);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
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
      throw new UnauthorizedException('Invalid or expired token');
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
}
