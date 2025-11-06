import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from 'src/modules/users/schema/users.schema';
import { Comments } from 'src/modules/comments/schema/comments.schema';
import { Types } from 'mongoose';

@Schema({collection: 'posts', timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})
export class Post extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, maxlength: 200 })
  title: string;

  @Prop({ type: String, default: null })
  content?: string;

  @Prop({ required: true, maxlength: 20 })
  type: string;

  @Prop({ type: Date, default: Date.now })
  time_stamp: Date;

  @Prop({ type: Number, default: 0 })
  upvotes: number;

  @Prop({ type: Number, default: 0 })
  downvotes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments?: Comments[];
}

export const PostSchema = SchemaFactory.createForClass(Post);