// Purpose: Detect whether route is public (skip auth). Otherwise, enforece JWT authentication

// AuthGuard('jwt'): Passport authentication strategy handler. Activates JwtStrategy
// Reflector: Reads metadata (@Public())
// UnauthorizedException: Throw proper HTTP 401
// ExecutionContext: Access route and request info

import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/decorators";
import { ErrorMessages, ErrorType } from "src/helper";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    );

    console.log("isPublic:::", isPublic);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException({
        error: ErrorType.Auth.InvalidCredentials,
        message: ErrorMessages[ErrorType.Auth.InvalidCredentials],
      });
    }

    return user;
  }
}
