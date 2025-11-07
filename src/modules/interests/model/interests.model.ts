import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
    collection: 'interests',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'},
})
export class Interests extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true})
    user_id: Types.ObjectId;

    @Prop({
        type: Object,
        required: true
    })
    category: {
        id: string;
        name: string;
        code: string;
    }
}

export const InterestsSchema = SchemaFactory.createForClass(Interests);

InterestsSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});