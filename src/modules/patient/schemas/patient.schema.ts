import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContactInfo } from '../../../common/utils/helper';
import { InsuranceDTO, MedicalTestResultDTO } from 'src/common/utils';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [ContactInfo], default: [] })
  contactInfos: ContactInfo[];

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  // @Prop({ required: true })
  // identity: string; // National ID or Passport

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
  number_children: number;

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

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  address?: string;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        relationToPatient: { type: String, required: true },
      },
    ],
    default: [], // Default to an empty array
    required: false, // Emergency contacts are optional
  })
  emergencyContacts?: {
    name: string;
    phone: string;
    relationToPatient: string;
  }[];

  @Prop({ type: [{ disease_name: String }], default: [] })
  ChronicDiseases?: { disease_name: string }[];

  @Prop({ type: [InsuranceDTO], default: [] })
  insurances?: InsuranceDTO[];

  @Prop({ type: [MedicalTestResultDTO], default: [] })
  medicalTestResults?: MedicalTestResultDTO[]; // نتائج الاختبارات الطبية

  @Prop({
    type: [String],
    default: [],
  })
  allergies: string[]; //  الحساسية

  @Prop({
    type: String,
    default: 'Arabic',
  })
  preferredLanguage: string; // اللغة المفضلة

  @Prop()
  lifestyleFactors: string; //العوامل الحياتية (التدخين، استهلاك الكحول، ممارسة الرياضة)

  @Prop({
    type: [String],
    default: [],
  })
  familyMedicalHistory: string[]; // قائمة بالأمراض الوراثية في العائلة

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({})
  Surgical_History: Date; // التاريخ الجراحي

  @Prop({})
  Current_Medications: string; // الأدوية الحالية

  @Prop({ default: false })
  Smoking: boolean; // التدخين

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
