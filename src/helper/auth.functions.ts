import { UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from 'src/modules/auth/dto/auth-response.dto';
import { User } from 'src/modules/users/schema/users.schema';
import { ErrorType } from './enum';
import { ErrorMessages } from './messages';

export async function handleGoogleAuthFlow(
  idToken: string,
): Promise<AuthResponseDto> {
  const payload = await verifyGoogleToken(idToken);
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
    // 2. Create user
    const newUser = tx.create(User, {
      email,
      name: payload.name ?? '',
      provider: 'google',
      provider_id: payload.sub,
    });

    const saved = await tx.save(User, newUser);
    return this.buildResponse(saved);
  });
}

async function verifyGoogleToken(idToken: string): Promise<any> {
  try {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new UnauthorizedException({
        error: ErrorType.InvalidGoogleToken,
        message: ErrorMessages[ErrorType.InvalidGoogleToken],
      });
    }
    return payload;
  } catch (err) {
    this.logger.error('Google token verification failed', err);
    throw new UnauthorizedException({
        error: ErrorType.InvalidGoogleToken,
        message: ErrorMessages[ErrorType.InvalidGoogleToken],
      });
  }
}

export async function buildResponse(user: User): Promise<AuthResponseDto> {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username ?? '',
      },
    };
  }