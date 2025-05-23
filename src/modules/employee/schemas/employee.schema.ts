import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  ContactInfo,
  WorkingHours,
  Vacation,
  BreakTime,
} from '../../../common/utlis/helper';
export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: ContactInfo, default: {} })
  contactInfos: ContactInfo;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ required: true, unique: true })
  identity: string;

  @Prop({ required: true })
  nationality: string;

  @Prop()
  image?: string;

  @Prop({
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    default: 'Single',
  })
  marital_status?: string;

  @Prop({ required: true })
  number_children: number;

  @Prop()
  notes?: string;

  @Prop({ required: true })
  address?: string;

  @Prop({})
  professional_experience: string;

  @Prop({ default: 0 })
  evaluation: number;

  @Prop({ type: [String], default: [] })
  Languages?: string[];

  @Prop({ type: [WorkingHours], default: [] })
  workingHours: WorkingHours[];

  @Prop({ type: [Vacation], default: [] })
  vacationRecords: Vacation[];

  @Prop({ required: true })
  hireDate: Date;

  @Prop()
  medicalLicenseNumber?: string;

  @Prop({ type: String, required: false })
  certifications?: string;

  @Prop({ type: String, required: false })
  Qualifications?: string;

  @Prop({ type: String, required: false })
  workPermit?: string;

  @Prop({ default: 0 })
  consultation_fee: number; // رسوم الاستشارة

  @Prop({ default: true })
  on_call: boolean;

  @Prop({
    required: true,
    enum: ['FULL_TIME', 'PART_TIME'],
    default: 'FULL_TIME',
  })
  jobType: string;

  @Prop({ type: [BreakTime], default: [] })
  breakTimes: BreakTime[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Specialization', required: true })
  specializations: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Clinic', required: false })
  clinic: Types.ObjectId[];

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
