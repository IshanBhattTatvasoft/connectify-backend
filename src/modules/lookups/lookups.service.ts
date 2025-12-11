import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Lookup } from './model/lookup.model';
import {
  LookupDetail,
  LookupDetailDocument,
} from './model/lookup_details.model';
import { AddLookupDetailDto } from './dto/lookup-detail.dto';
import { ErrorMessages, ErrorType } from 'src/helper';
import { GetLookupDetail } from './interface/lookup_detail.interface';

@Injectable()
export class LookupsService {
  constructor(
    @InjectModel(Lookup.name) private lookupModel: Model<Lookup>,
    @InjectModel(LookupDetail.name)
    private lookupDetailModel: Model<LookupDetail>,
  ) {}

  async getLookupDetailByCodes(lookupCode: string, lookupDetailCode: string): Promise<GetLookupDetail> {
    console.log('lookupCode received:', lookupCode);
    console.log('lookupDetailCode received:', lookupDetailCode);
    const lookup = await this.lookupModel.findOne({
      code: lookupCode,
    });
    console.log('lookup found:', lookup);
    if (!lookup) {
      throw new BadRequestException({
        error: ErrorType.Lookup.LookupNotFound,
        message: ErrorMessages[ErrorType.Lookup.LookupNotFound],
      });
    }
    const lookupDetail = await this.lookupDetailModel
    .findOne({ lookup_id: lookup._id, code: lookupDetailCode })
    
    console.log('lookup detail found:', lookupDetail);
    if (!lookupDetail) {
      throw new BadRequestException({
        error: ErrorType.Lookup.LookupNotFound,
        message: ErrorMessages[ErrorType.Lookup.LookupNotFound],
      });
    }

    const lookupDetailResponse : GetLookupDetail = {
      lookup: {
        id: (lookup._id as ObjectId).toString(),
        name: lookup.name,
        code: lookup.code
      },
      lookup_detail: {
        id: (lookupDetail._id as ObjectId).toString(),
        name: lookupDetail.name,
        code: lookupDetail.code
      }
    }
    
    return lookupDetailResponse;
  }

  async createLookupValues(
    addLookupDetailDto: AddLookupDetailDto,
    lookup_id: string,
  ): Promise<LookupDetail> {
    console.log('addLookupDetailDto: ', addLookupDetailDto);
    console.log('lookup_id: ', lookup_id);
    const isLookupExist = await this.lookupModel.findOne({ _id: lookup_id });

    if (!isLookupExist) {
      throw new BadRequestException({
        error: ErrorType.Lookup.LookupNotFound,
        message: ErrorMessages[ErrorType.LookupNotFound],
      });
    }

    const { name, code } = addLookupDetailDto;
    const isLookupValueExists = await this.lookupDetailModel.findOne({
      lookup_id: lookup_id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
    });

    if (isLookupValueExists) {
      throw new BadRequestException({
        error: ErrorType.Lookup.LookupValueExists,
        message: ErrorMessages[ErrorType.LookupValueExists],
      });
    }

    const newLookupValue = new this.lookupDetailModel({
      name: name,
      code: code,
      lookup_id: lookup_id,
    });

    const savedLookupValue = await newLookupValue.save();
    return savedLookupValue;
  }
}
