// src/modules/users/schema/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Roles } from 'src/modules/roles/schema/roles.schema';
import { Post } from 'src/modules/posts/schema/posts.schema';
import { Comments } from 'src/modules/comments/schema/comments.schema';

@Schema({ collection: 'users', timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'} })
export class User extends Document {
  @Prop({ required: true, unique: true, maxlength: 100 })
  username: string;

  @Prop({ required: true, unique: true, maxlength: 150 })
  email: string;

  @Prop({ required: false })
  password_hash?: string;

  @Prop({ required: false, maxlength: 15 })
  mobile_no?: string;

  @Prop({ required: false, type: String })
  address?: string;

  // Reference to Role
  @Prop({ type: Types.ObjectId, ref: Roles.name, required: false })
  role_id?: Types.ObjectId;

  @Prop({ required: false })
  provider_id?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);