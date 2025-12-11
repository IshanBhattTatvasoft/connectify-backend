import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CommunityService } from './community.service';
import { ResponseUtil } from 'src/interceptors/response.interceptor';
import { CommunityOperation } from 'src/helper/enum';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createCommunity(@CurrentUser() user, @Req() req) {
    const result = await this.communityService.createCommunity(user, req.body);
    return ResponseUtil.success(
      result,
      CommunityOperation.CREATE,
      HttpStatus.OK,
    );
  }
}
