import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'lookup',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Lookup extends Document {
  @Prop({ required: true, unique: true, maxLength: 50 })
  name: string;

  @Prop({ required: true, unique: true, maxLength: 50 })
  code: string;
}

export const LookupSchema = SchemaFactory.createForClass(Lookup);
LookupSchema.pre('findOneAndUpdate', function (next) {
    this.set({updated_at: new Date()});
    next();
});