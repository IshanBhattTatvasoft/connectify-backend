import { Controller, Post, Req, HttpStatus, Body, Param } from '@nestjs/common';
import { LookupsService } from './lookups.service';
import { AddLookupDetailDto } from './dto/lookup-detail.dto';
import { IResponse, RouteIdsParamsDto } from 'src/helper/interface';
import { LookupDetail } from './interface/lookup_detail.interface';
import { ResponseUtil } from 'src/interceptors/response.interceptor';
import { LookupsOperation } from 'src/helper/enum';
import { toLookupDetailResponse } from 'src/helper/utils';

@Controller('lookups')
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Post('get-lookup-detail')
  async getLookupDetail(@Req() req) {
    const { lookupCode, lookupDetailCode } = req.body;

    if (!lookupCode || !lookupDetailCode) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'lookupCode and lookupDetailCode are required',
      };
    }

    const lookupDetail = await this.lookupsService.getLookupDetailByCodes(
      lookupCode,
      lookupDetailCode,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Lookup detail fetched successfully',
      data: lookupDetail,
    };
  }

  @Post('/:id/values')
  async addLookupDetail(
    @Body() addLookupDetailDto: AddLookupDetailDto,
    @Param() params: RouteIdsParamsDto,
  ): Promise<IResponse<LookupDetail>> {
    const { id } = params;
    const result = await this.lookupsService.createLookupValues(
      addLookupDetailDto,
      id,
    );
    return ResponseUtil.success(
      toLookupDetailResponse(result),
      LookupsOperation.CREATED,
      HttpStatus.OK,
    );
  }
}
