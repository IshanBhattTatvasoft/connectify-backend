import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/users/model/users.model';
import { Comments } from 'src/modules/comments/model/comments.model';
import { Types } from 'mongoose';

@Schema({
  collection: 'posts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Post extends Document {
  @Prop({ required: true, maxlength: 200 })
  title: string;

  @Prop({ type: String, default: null })
  content?: string;

  @Prop({
    type: Object,
    required: true,
  })
  content_type: {
    id: string;
    name: string;
    code: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Community', required: true })
  community_id: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  upvotes: number;

  @Prop({ type: Number, default: 0 })
  downvotes: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.pre('findOneAndUpdate', function (next) {
  this.set({updated_at: new Date()});
  next();
})