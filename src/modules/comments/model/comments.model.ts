import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Comments extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Posts', required: true })
  post_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comments', default: null })
  parent_comment_id?: Types.ObjectId | null;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Number, default: 0 })
  upvotes: number;

  @Prop({ type: Number, default: 0 })
  downvotes: number;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});
