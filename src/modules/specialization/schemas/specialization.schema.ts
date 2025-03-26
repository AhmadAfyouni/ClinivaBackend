import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SpecializationDocument = Specialization & Document;

@Schema({ timestamps: true })
export class Specialization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  requiredEquipment: string[]; // المعدات المطلوبة

  @Prop({ required: true, type: [String] })
  requiredStaff: string[]; // الموظفين المطلوبين

  @Prop({ required: true, type: [String] })
  medicalProcedures: string[]; // الإجراءات الطبية

  @Prop({ required: true })
  certificationRequirements: string; // متطلبات الشهادات

  @Prop({ required: true, default: true })
  isActive: boolean; // هل التخصص نشط؟
}

export const SpecializationSchema = SchemaFactory.createForClass(Specialization);
