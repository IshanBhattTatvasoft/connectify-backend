import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'comments',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Comments extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Posts', required: true })
  post_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comments', default: null })
  parent_comment_id: Types.ObjectId;

  // Materialized path for nested comments
  @Prop({ type: [Types.ObjectId], default: [] })
  ancestors: Types.ObjectId[];

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Number, default: 0 })
  upvotes: number;

  @Prop({ type: Number, default: 0 })
  downvotes: number;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});

CommentsSchema.index({ post_id: 1, parent_comment_id: 1 });
CommentsSchema.index({ post_id: 1, ancestors: 1 });