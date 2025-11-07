import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop({ required: true, unique: true, maxLength: 100 })
  username: string;

  @Prop({ required: true, unique: true, maxlength: 150 })
  email: string;

  @Prop({ required: false })
  password_hash?: string;

  @Prop({ required: false, maxLength: 15 })
  mobile_no?: string;

  @Prop({ required: false, type: String})
  address?: string;

  @Prop({ required: false })
  provider_id?: string;

  @Prop({
    type: Object,
    default: null,
  })
  status: {
    id?: string;
    name: string;
    code: string;
  };

  @Prop({ type: Date, default: Date.now }) // created timestamp
  created_at: Date;

  @Prop({ type: Date, default: null })
  updated_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});