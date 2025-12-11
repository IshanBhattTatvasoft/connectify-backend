import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  collection: 'user',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User extends Document {
  @Prop({ required: true, unique: true, maxLength: 100 })
  username: string;

  @Prop({ required: true, unique: true, maxlength: 150 })
  email: string;

  @Prop()
  password_hash?: string;

  @Prop({ maxLength: 15 })
  mobile_no?: string;

  @Prop({ maxlength: 300 })
  address?: string;

  @Prop()
  provider_id?: string;

  @Prop({ type: Types.ObjectId, ref: 'LookupDetail', required: true }) // reference from LookupDetails table
  status_id: Types.ObjectId;

  @Prop()
  otp?: string;

  @Prop()
  otp_expiration_time?: Date;

  @Prop({ default: false })
  is_reset_token_used: boolean;

  @Prop()
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});
