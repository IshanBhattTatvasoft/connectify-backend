// Purpose: Validate the JWT token and attach the user to request.user

// passport-jwt: JWT validation strategy
// ExtractJwt: Extracts token from Authorization header
// InjectModel: Inject Mongoose model into service
// Users model: Fetch user from DB to verify existence
// UnauthorizedException: HTTP 401 if user missing

// Execution Order:
// 1. Controller called -> Guard triggers
// 2. JwtAuthGuard.canActivate() -> Checks @Public (skips or continue)
// 3. JwtStrategy.validate() -> Validates token signature (fetch user from DB)
// 4. JwtAuthGuard.handleRequest() -> If valid, attach user; else throw error
// 5. Controller execution -> Now we can access request.user

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/model/users.model';
import { ErrorMessages, ErrorType } from 'src/helper';
import { JwtPayload } from '../interfaces/auth-user.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // If we want to try multiple ways of extracting token, we can use: ExtractJwt.fromExtractors({}) and there we define each way to extract token.
      secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('payload::: ', payload);
    // lean option returns plain JS objects instead of Mongoose documents
    const user = await this.userModel.findById(payload.sub);
    console.log('user::: ', user);

    if (!user) {
      throw new UnauthorizedException({
        error: ErrorType.Common.Unauthorized,
        message: ErrorMessages[ErrorType.Unauthorized],
      });
    }
    const idAsString = (user._id as ObjectId).toHexString();
    const statusIdAsString = user.status_id.toHexString();
    return {
      id: idAsString,
      email: user.email,
      status: statusIdAsString,
    };
  }
}
