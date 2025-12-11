import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { convertCodeToName } from 'src/helper/utils';
import { Lookup } from 'src/modules/lookups/model/lookup.model';
import { LookupDetail } from 'src/modules/lookups/model/lookup_details.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LookupSeeder {
  constructor(
    @InjectModel(Lookup.name)
    private lookupModel: Model<Lookup>,
    @InjectModel(LookupDetail.name)
    private lookupDetailModel: Model<LookupDetail>,
  ) {}
  

  async run() {
    await this.seedLookup('ACCOUNT_STATUS', ['ACTIVE', 'SUSPENDED', 'DELETED']);
    await this.seedLookup('POST_TYPE', ['TEXT', 'IMAGE', 'VIDEO']);
    await this.seedLookup('ROLE', ['OWNER', 'MODERATOR', 'MEMBER']);
  }

  private async seedLookup(code: string, details: string[]) {
    let lookup = await this.lookupModel.findOne({ code });

    if(!lookup){
        lookup = await this.lookupModel.create({
            name: convertCodeToName(code),
            code
        });
    }

    for(const detail of details){
        const exists = await this.lookupDetailModel.findOne({
            lookup_id: lookup._id,
            code: detail
        });

        if(!exists){
            await this.lookupDetailModel.create({
                lookup_id: lookup._id,
                name: convertCodeToName(detail),
                code: detail
            });
        }
    }
  }
}