import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'lookup_details',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class LookupDetail extends Document {
  @Prop({ required: true, unique: true, maxLength: 50 })
  name: string;

  @Prop({ required: true, unique: true, maxLength: 50 })
  code: string;

  @Prop({ type: Types.ObjectId, ref: 'Lookup', required: true})
  lookup_id: Types.ObjectId;
}

export const LookupDetailSchema = SchemaFactory.createForClass(LookupDetail);
export type LookupDetailDocument = LookupDetail & Document;

LookupDetailSchema.pre('findOneAndUpdate', function (next) {
    this.set({updated_at: new Date()});
    next();
});

LookupDetailSchema.index({ lookup_id: 1 });
LookupDetailSchema.index({ lookup_id: 1, code: 1 }, { unique: true });