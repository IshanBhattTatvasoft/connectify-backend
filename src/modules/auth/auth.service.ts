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
import { User, UserDocument } from '../users/schema/users.schema';
import { AuthenticatedUser } from './interfaces/auth-user.interface';
import { buildResponse, handleGoogleAuthFlow } from 'src/helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  /** ------------------ Token Builders ------------------ */
  async buildResponse(user: UserDocument): Promise<AuthResponseDto> {
    const payload = { sub: (user._id as Types.ObjectId).toString(), email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.seconds(process.env.ACCESS_TOKEN_EXPIRY ?? '15m'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.seconds(process.env.REFRESH_TOKEN_EXPIRY ?? '7d'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        username: user.username ?? '',
      },
    };
  }

  /** ------------------ Helpers ------------------ */
  private seconds(value: string): number {
    const map: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    const match = value.match(/^(\d+)([smhd]?)$/);
    if (!match) return 900; // default 15m
    return parseInt(match[1], 10) * (map[match[2]] || 60);
  }

  /** ------------------ Login / Validation ------------------ */
  async validateUser(
    loginUserDTO: LoginUserDTO,
  ): Promise<AuthenticatedUser | null> {
    const { email, password } = loginUserDTO;

    const user = await this.userModel
      .findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
      .select('+password_hash')
      .exec();

    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password_hash!);
    if (!passwordMatch) return null;

    const { password_hash, ...rest } = user.toObject();
    return rest as AuthenticatedUser;
  }

  /** ------------------ Signup ------------------ */
  async signUp(dto: SignupUserDTO): Promise<AuthResponseDto> {
    if (dto.id_token) {
      return handleGoogleAuthFlow(dto.id_token);
    }

    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const newUser = new this.userModel({
      email: dto.email,
      password_hash: hash,
    });

    const savedUser = await newUser.save();
    return this.buildResponse(savedUser);
  }
}
