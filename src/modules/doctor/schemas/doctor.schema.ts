import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkingHours } from '../../../common/utlis/helper';
export class Insurance {
    @Prop({ type: String, required: true })
    insuranceProvider: string;
  
    @Prop({ type: String, required: true })
    insuranceNumber: string;
  
    @Prop({ type: Number, min: 0, max: 100, required: true })
    coveragePercentage: number;
  
    @Prop({ type: Date, required: true })
    expiryDate: Date;
  
    @Prop({
      type: String,
      enum: ['private', 'governmental', 'corporate'],
      required: true,
    })
    insuranceType: string;
  }
  
export type DoctorDocument = Doctor & Document;
@Schema({ timestamps: true })
export class Doctor {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({})
  phone: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop({ required: true, unique: true })
  identity?: string; // National ID or Passport

  @Prop({ required: true })
  nationality?: string;

  @Prop()
  image?: string;

  @Prop({
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'], // القيم المسموحة فقط
    default: 'Single', // القيمة الافتراضية
  })
  marital_status?: string;

  @Prop({ required: true })
  number_children?: number;

  @Prop({
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], // القيم المسموحة فقط
  })
  blood_type?: string;

  @Prop()
  height?: number; // in cm

  @Prop()
  weight?: number; // in kg

  @Prop()
  notes?: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  address?: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    required: false, // Emergency contact is optional
  })
  emergencyContact?: {
    name: string;
    phone: string;
  };
//   @Prop({ type: [{ medication_name: String }], default: [] })
//   RegularMedications?: { medication_name: string }[];

  @Prop({ type: [{ disease_name: String }], default: [] })
  ChronicDiseases?: { disease_name: string }[];

  @Prop({ type: [Insurance], default: [] })
  insurances: Insurance[];

  @Prop({})
  professiona_experience: string;

  @Prop({ type: [String], default: [] })
  specialties: string[]; // تخصصات الطبيب

  @Prop({ type: [String], default: [] })
  Languages?: string[];

  @Prop({ type: [WorkingHours], default: [] })
  workingHours: WorkingHours[];

  @Prop()
  evaluation?: number; // Example: 1-10 rating system

  // Access Control Directly in Doctor Schema
//      @Prop({ type: Types.ObjectId, ref: 'Department',  default: null })
//   departmentId: Types.ObjectId;  // Doctor must belong to a department

  // @Prop({ type: [Types.ObjectId], ref: 'Clinic', default: [] })
  // clinics: Types.ObjectId[]; // Clinics where the doctor works
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
