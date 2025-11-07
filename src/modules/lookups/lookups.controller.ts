import { Controller, Post, Req, HttpStatus } from '@nestjs/common';
import { LookupsService } from './lookups.service';

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
}
