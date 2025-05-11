import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SpecializationDocument = Specialization & Document;

@Schema({ timestamps: true })
export class Specialization {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  requiredEquipment: string[];

  @Prop({ required: true, type: [String] })
  requiredStaff: string[];

  @Prop({ required: true, type: [String] })
  medicalProcedures: string[];

  @Prop({ required: true })
  certificationRequirements: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const SpecializationSchema =
  SchemaFactory.createForClass(Specialization);
