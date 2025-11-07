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
import { buildResponse, handleGoogleAuthFlow } from 'src/helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

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
  async signUp(dto: SignupUserDTO): Promise<Partial<User>> {
    if (dto.id_token) {
      return handleGoogleAuthFlow(dto.id_token, this.userModel, this.jwtService);
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

    const userResponse: Partial<User> = {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      created_at: savedUser.created_at,
      status: {
        name: 'active',
        code: 'ACTIVE'
      }
    };

    return userResponse;
  }
}
