// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

import { Users } from '../users/entity/users.entity';
import { Roles } from '../roles/entity/roles.entity';
import { SignupUserDTO } from './dto/signup-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;
  private readonly defaultRoleName = 'USER';

  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Roles)
    private readonly rolesRepo: Repository<Roles>,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /* -------------------------------------------------
   *  PUBLIC API
   * ------------------------------------------------*/
  async signup(dto: SignupUserDTO): Promise<AuthResponseDto> {
    if (dto.id_token) {
      return this.handleGoogleFlow(dto.id_token);
    }

    // ---- Local signup ----
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const exists = await this.usersRepo.findOneBy({ email: dto.email });
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      password: hash,
      // optionally set default role here if you don't use a trigger
    } as any);

    const saved = await this.usersRepo.save(user);
    return this.buildResponse(saved[0]);
  }

  async login(dto: LoginUserDTO): Promise<AuthResponseDto> {
    if (dto.id_token) {
      return this.handleGoogleFlow(dto.id_token);
    }

    // ---- Local login ----
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.usersRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password', 'role'],
      relations: ['role'],
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildResponse(user);
  }

  /* -------------------------------------------------
   *  PRIVATE HELPERS
   * ------------------------------------------------*/
  private async handleGoogleFlow(idToken: string): Promise<AuthResponseDto> {
    const payload = await this.verifyGoogleToken(idToken);
    const email = payload.email!;

    let user = await this.usersRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (user) {
      return this.buildResponse(user);
    }

    // ---- First-time Google user ----
    return this.usersRepo.manager.transaction(async (tx) => {
      // 1. Resolve default role (cached in prod)
      let role = await tx.findOne(Roles, {
        where: { name: this.defaultRoleName },
      });
      if (!role) {
        this.logger.warn(
          `Default role "${this.defaultRoleName}" not found – creating it`,
        );
        role = tx.create(Roles, { name: this.defaultRoleName });
        await tx.save(Roles, role);
      }

      // 2. Create user
      const newUser = tx.create(Users, {
        email,
        name: payload.name ?? '',
        provider: 'google',
        provider_id: payload.sub,
        role,
      });

      const saved = await tx.save(Users, newUser);
      return this.buildResponse(saved);
    });
  }

  private async verifyGoogleToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) {
        throw new UnauthorizedException('Invalid Google token');
      }
      return payload;
    } catch (err) {
      this.logger.error('Google token verification failed', err);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  private async buildResponse(user: Users): Promise<AuthResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name ?? this.defaultRoleName,
    };
    
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.username ?? '',
        role: user.role?.name ?? this.defaultRoleName,
      },
    };
  }
}
