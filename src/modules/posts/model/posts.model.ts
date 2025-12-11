import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/users/model/users.model';
import { Comments } from './comments.model';
import { Types } from 'mongoose';

@Schema({
  collection: 'posts',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Post extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Community', required: true })
  community_id: Types.ObjectId;

  @Prop({ required: true, maxlength: 200 })
  title: string;

  @Prop({ type: String, default: null })
  content?: string;

  @Prop({ type: Types.ObjectId, ref: 'LookupDetail', required: true })
  content_type_id: Types.ObjectId;

  @Prop()
  media_url: Array<string>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.pre('findOneAndUpdate', function (next) {
  this.set({updated_at: new Date()});
  next();
})

PostSchema.index({ community_id: 1, created_at: -1 });
PostSchema.index({ upvotes: -1, created_at: -1 });