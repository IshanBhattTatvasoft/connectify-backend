import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lookup } from './model/lookup.model';
import { LookupDetail } from './model/lookup_details.model';

@Injectable()
export class LookupsService {
  constructor(
    @InjectModel(Lookup.name) private lookupModel: Model<Lookup>,
    @InjectModel(LookupDetail.name) private lookupDetailModel: Model<LookupDetail>,
  ) {}

  async getLookupDetailByCodes(lookupCode: string, lookupDetailCode: string) {
    console.log('lookupCode received:', lookupCode);
    const lookup = await this.lookupModel.findOne({ code: { $regex: `^${lookupCode.trim()}$`, $options: 'i' }, });
    console.log('lookup found:', lookup);
    if (!lookup) throw new NotFoundException(`Lookup not found for code: ${lookupCode}`);

    const lookupDetail = await this.lookupDetailModel
      .findOne({ lookup_id: lookup._id, code: lookupDetailCode })
      .populate('lookup_id', 'code name');

    if (!lookupDetail)
      throw new NotFoundException(`Lookup detail not found for code: ${lookupDetailCode}`);

    return lookupDetail;
  }
}
