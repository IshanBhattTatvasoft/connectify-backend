import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'community',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Community extends Document {
  @Prop({ required: true, maxLength: 30 })
  name: string;

  @Prop()
  subTitle: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category_id: Types.ObjectId;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);

CommunitySchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});

CommunitySchema.index({ category_id: 1});
CommunitySchema.index({ name: 1});