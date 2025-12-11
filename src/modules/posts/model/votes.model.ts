import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'votes',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Votes extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Posts', required: true })
  post_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comments', required: true })
  comment_id?: Types.ObjectId;

  @Prop({ required: true, type: Boolean })
  is_upvote: boolean;
}

export const VotesSchema = SchemaFactory.createForClass(Votes);
VotesSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});
VotesSchema.index({ user_id: 1 });
