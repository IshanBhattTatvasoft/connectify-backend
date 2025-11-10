import {
  BadRequestException,
  Injectable,
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
import { ErrorMessages, ErrorType, generateToken, handleGoogleAuthFlow, Mailer } from 'src/helper';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private oauthClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/api/auth/google/callback',
  );

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  /** ------------------ Login / Validation ------------------ */
  async login(
    dto: LoginUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log('dto::: ', dto);
    if (dto.id_token) {
      return handleGoogleAuthFlow(
        dto.id_token,
        this.userModel,
        this.jwtService,
      );
    }

    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.userModel.findOne({ email: dto.email });
    if (!existing) {
      throw new BadRequestException(
        'User does not exist. Please create an account',
      );
    }

    if (existing.provider_id !== 'google' && existing.password_hash) {
      const isPasswordValid = await bcrypt.compare(
        dto.password,
        existing.password_hash,
      );
      if (!isPasswordValid)
        throw new BadRequestException('Invalid credentials');
    }

    return generateToken(existing, this.jwtService);
  }

  /** ------------------ Signup ------------------ */
  async signUp(
    dto: SignupUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (dto.id_token) {
      return handleGoogleAuthFlow(
        dto.id_token,
        this.userModel,
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

    return generateToken(savedUser, this.jwtService);
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

    if (!user) {
      user = new this.userModel({
        username: payload.email.split('@')[0],
        email: payload.email,
        provider: 'google',
        provider_id: payload.sub,
        name: payload.name,
        picture: payload.picture,
      });

      await user.save();
    }

    const { accessToken, refreshToken } = await generateToken(
      user,
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
    const existingUser = await this.userModel.findOne({ email: lowerEmail });
    if(!existingUser) return;

    if(existingUser.status.code !== 'ENABLED'){
      throw new BadRequestException({
        error: ErrorType.AccountNotEnabled,
        message: ErrorMessages[ErrorType.AccountNotEnabled]
      });
    }

    const otpGenerated = Math.floor(100000 + Math.random() * 900000).toString();
    const otpTimeout = 60 * 1000;

    await this.sendVerificationEmail(existingUser, existingUser.email, otpGenerated, `${otpTimeout} minutes`);
  }

  private async sendVerificationEmail(
    user: User,
    email: string,
    generatedOTP: string,
    expiresIn: string
  ) {
    const subject = 'Your Password Reset Verification Code';
    const htmlMessage = `
    <p>Dear ${user.username},</p>
    <p>You have requested to reset your password.<br>Your verification code is: <strong>${generatedOTP}</strong></p>
    <p>This code is valid for <strong>${expiresIn}</strong> only. For security reasons, please do not share this code with anyone.</p>
    <p>Thank you,<br>Connectify Support Team</p>
  `;
    await Mailer.sendMail(email, subject, htmlMessage);
  }
}
