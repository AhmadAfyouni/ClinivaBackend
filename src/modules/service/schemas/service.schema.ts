import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({ required: true, unique: false })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Clinic', required: true })
  clinic: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], required: true })
  doctors: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Number, default: 30 }) // default duration of 30 minutes
  duration: number;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
