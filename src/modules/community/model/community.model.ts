import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'community',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Community extends Document {
  @Prop({ required: true, maxLength: 30 })
  name: string;

  @Prop({ required: true, maxLength: 20 })
  slug: string;

  @Prop({
    type: Object,
    required: true,
  })
  category: {
    id: string;
    name: string;
    code: string;
  };
}

export const CommunitySchema = SchemaFactory.createForClass(Community);

CommunitySchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});
