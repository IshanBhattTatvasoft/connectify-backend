import { Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ResponseUtil } from 'src/interceptors/response.interceptor';
import { UsersOperation } from 'src/helper/enum';
import { IResponse } from 'src/helper/interface';
import { User } from '../users/model/users.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signup(@Req() req): Promise<IResponse<Partial<User>>> {
    const result = await this.authService.signUp(req.body);
    return ResponseUtil.success(result, UsersOperation.SIGNUP, HttpStatus.OK);
  }
}
