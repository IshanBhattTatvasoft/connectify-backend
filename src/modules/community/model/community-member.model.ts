import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'community_member',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class CommunityMember extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Community', required: true })
  community_id: Types.ObjectId;

  @Prop({
    type: Object,
    required: true,
  })
  role: {
    id: string;
    name: string;
    code: string;
  };

  @Prop({ required: true })
  is_active: boolean;

  @Prop({ required: true })
  is_deleted: boolean;
}

export const CommunityMemberSchema =
  SchemaFactory.createForClass(CommunityMember);
CommunityMemberSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});