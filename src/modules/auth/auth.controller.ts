import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ResponseUtil } from 'src/interceptors/response.interceptor';
import { UsersOperation } from 'src/helper/enum';
import { IResponse } from 'src/helper/interface';
import { User } from '../users/model/users.model';
import { SendOtpDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signup(
    @Req() req,
  ): Promise<IResponse<{ accessToken: string; refreshToken: string }>> {
    const result = await this.authService.signUp(req.body);
    return ResponseUtil.success(result, UsersOperation.SIGNUP, HttpStatus.OK);
  }

  @Post('google/callback')
  async handleGoogleCallback(@Body('code') code: string): Promise<IResponse<{ accessToken: string; refreshToken: string }>> {
    const result = await this.authService.handleGoogleCallback(code);
    return ResponseUtil.success(result, UsersOperation.LOGIN, HttpStatus.OK);
  }

  @Post('forgot-password/send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<IResponse<null>> {
    await this.authService.sendOtp(sendOtpDto.email);
    return ResponseUtil.success(null, UsersOperation.OTP_SENT, HttpStatus.OK);
  }
}
