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

  @Prop({ type: Types.ObjectId, ref: 'LookupDetail', required: true })
  role_id: Types.ObjectId;

  @Prop({ default: false })
  is_banned: boolean; // true = removed by moderator

  @Prop({ required: true, type: Date})
  joined_at: Date;
  
  @Prop()
  left_at?: Date;
}

export const CommunityMemberSchema =
  SchemaFactory.createForClass(CommunityMember);
export type CommunityMemberDocument = CommunityMember & Document;

CommunityMemberSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});

CommunityMemberSchema.index({ user_id: 1, community_id: 1}, {unique: true});