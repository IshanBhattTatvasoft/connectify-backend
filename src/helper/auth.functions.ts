import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  AuthResponseDto,
  JwtPayloadDto,
} from 'src/modules/auth/dto/auth-response.dto';
import { User, UserDocument } from 'src/modules/users/model/users.model';
import { ErrorType } from './enum';
import { ErrorMessages } from './messages';
import { Model, Types } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GooglePayload {
  email: string;
  name?: string;
  sub: string;
  picture?: string;
}

export async function handleGoogleAuthFlow(
  idToken: string,
  userModel: Model<User>,
  jwtService: JwtService,
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = await verifyGoogleToken(idToken);

  // Find existing user by email
  let user = await userModel.findOne({ email: payload.email }).exec();

  // If user exists but not via Google → block
  if (user && user.provider_id && user.provider_id !== 'google') {
    throw new BadRequestException(
      'Email already registered with another provider',
    );
  }

  // If user exists and is Google → login
  if (user) {
    return generateToken(user, jwtService);
  }

  // First-time Google user → create
  const username = payload.email.split('@')[0];
  const newUser = new userModel({
    email: payload.email,
    username,
    provider: 'google',
    provider_id: payload.sub,
    name: payload.name,
    picture: payload.picture,
  });

  const savedUser = await newUser.save();
  return generateToken(savedUser, jwtService);
}

async function verifyGoogleToken(idToken: string): Promise<GooglePayload> {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new Error();
    }
    return {
      email: payload.email,
      name: payload.name,
      sub: payload.sub,
      picture: payload.picture,
    };
  } catch (error) {
    throw new UnauthorizedException('Invalid Google token');
  }
}

export async function generateToken(
  user: User,
  jwtService: JwtService,
): Promise<{ accessToken: string; refreshToken: string }> {
  const idAsString = (user._id as ObjectId).toHexString();
  const payload: Record<string, any> = {
    sub: idAsString,
    email: user.email,
    username: user.username,
    status: user.status?.code,
    iat: Math.floor(Date.now() / 1000),
  };
  const accessToken = await jwtService.signAsync(payload as any, {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY ?? ('15m' as any),
  });

  const refreshToken = await jwtService.signAsync(payload as any, {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY ?? ('7d' as any),
  });

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}
