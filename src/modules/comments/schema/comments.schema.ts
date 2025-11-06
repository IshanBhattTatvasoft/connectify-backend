import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/users/schema/users.schema';
import { Post } from 'src/modules/posts/schema/posts.schema';

export type CommentDocument = HydratedDocument<Comments>;

@Schema({
  collection: 'comments',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Comments {
  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Comments.name, default: null })
  parent_comment_id?: Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Date, default: Date.now })
  time_stamp: Date;

  @Prop({ type: Number, default: 0 })
  upvotes: number;

  @Prop({ type: Number, default: 0 })
  downvotes: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
