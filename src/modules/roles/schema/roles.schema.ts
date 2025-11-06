import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Roles>;

@Schema({
  collection: 'roles',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Roles {
  @Prop({ type: String, required: true, unique: true, maxlength: 50 })
  name: string;

  @Prop({ type: String, required: true, unique: true, maxlength: 50 })
  code: string;
}

export const RoleSchema = SchemaFactory.createForClass(Roles);
