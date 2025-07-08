import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContactInfoDTO, DayOfWeek } from 'src/common/utils/helper.dto';

import { MongooseDocument } from 'src/common/utils/filter-sort.util';
import {
  ContactInfo,
  ActivityLog,
  LoginHistory,
  Vacation,
  WorkingHours,
  Shift,
} from 'src/common/utils/helper';
import { ShiftBase } from 'src/common/utils';

export type EmployeeDocument = Employee & MongooseDocument;

@Schema({ timestamps: true })
export class Employee {
  _id: Types.ObjectId;

  @Prop({
    required: [true, 'Name is required'],
    unique: [true, 'Name must be unique'],
    trim: true,
  })
  name: string;

  @Prop({ required: false, trim: true })
  fullName: string;

  // @Prop({
  //   required: [true, 'User is required'],
  //   type: Types.ObjectId,
  //   ref: 'User',
  // })
  // userId: Types.ObjectId;

  @Prop({
    required: true,
    // match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
    // message:
    //   'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: [true, 'Email must be unique'],
    uniqueCaseInsensitive: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  })
  email: string;

  @Prop({
    required: [true, 'Employee type is required'],
    enum: ['Staff Member', 'Doctor', 'Admin'],
  })
  employeeType: string;

  @Prop({
    type: {
      phoneNumber1: { type: String, required: false },
      phoneNumber2: { type: String, required: false },
      email: { type: String, required: false },
      buildingNumber: { type: String, required: false },
      streetName: { type: String, required: false },
      region: { type: String, required: false },
      country: { type: String, required: false },
      nation: { type: String, required: false },
      emergencyContactName: { type: String, required: false },
      emergencyContactPhone: { type: String, required: false },
      emergencyContactRelationship: { type: String, required: false },
    },
    required: false,
    _id: false,
  })
  contactInfos: ContactInfoDTO;

  @Prop({ required: false })
  dateOfBirth: Date;

  @Prop({
    required: [true, 'Gender is required'],
    enum: ['male', 'female'],
    default: 'male',
  })
  gender: string;

  @Prop({
    required: false,
    unique: false,
  })
  identity: string;

  @Prop({ required: false, trim: true })
  nationality?: string;

  @Prop()
  image?: string;

  @Prop({
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    default: 'Single',
  })
  marital_status?: string;

  @Prop({ min: [0, 'Number of children must be at least 0'] })
  number_children: number;

  @Prop()
  notes?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({})
  professional_experience: string;

  @Prop({ default: 0 })
  evaluation: number;

  @Prop({
    type: [String],
    default: [],
    enum: [
      'Arabic',
      'English',
      'French',
      'German',
      'Spanish',
      'Italian',
      'Russian',
      'Chinese',
      'Japanese',
      'Korean',
    ],
  })
  Languages?: string[];

  @Prop({
    type: [
      {
        day: { type: String, enum: DayOfWeek },
        shift1: {
          type: Object,
          default: { startTime: '08:00', endTime: '13:00' },
        },
        shift2: {
          type: Object,
          default: { startTime: '08:00', endTime: '13:00' },
        },
      },
    ],
    default: [],
  })
  workingHours: Array<{
    day: string;
    shift1: {
      startTime: string;
      endTime: string;
    };
    shift2: {
      startTime: string;
      endTime: string;
    };
  }>;

  @Prop({ type: [Vacation], default: [] })
  vacationRecords: Vacation[];

  @Prop({ required: true, default: new Date() })
  hireDate: Date;

  @Prop()
  medicalLicenseNumber?: string;

  @Prop({ required: false })
  certificationsEffectiveDate: Date;

  @Prop({ type: String, required: false })
  certifications?: string;

  @Prop({ type: Number, required: false })
  certificationsSize?: number;

  @Prop({ required: false })
  employmentContractEffectiveDate: Date;

  @Prop({ type: String, required: false })
  employmentContract?: string;

  @Prop({ type: Number, required: false })
  employmentContractSize?: number;

  @Prop({ require: false })
  CVEffectiveDate: Date;

  @Prop({ type: String, required: false })
  CV?: string;

  @Prop({ type: Number, required: false })
  CVSize?: number;

  @Prop({ required: false })
  workPermitEffectiveDate: Date;

  @Prop({ type: String, required: false })
  workPermit?: string;

  @Prop({ type: Number, required: false })
  workPermitSize?: number;

  @Prop({ type: String, required: false })
  Qualifications?: string;

  @Prop({ default: 0 })
  consultation_fee: number; // رسوم الاستشارة

  @Prop({ default: '', required: false })
  Relationship: string;

  @Prop({ default: true })
  on_call: boolean;

  @Prop({
    required: true,
  })
  jobTitle: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Specialization' })
  specializations: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Clinic' })
  clinic: Types.ObjectId[];

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Role', required: true })
  roleIds: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date;

  @Prop()
  lastPasswordUpdate?: Date;

  @Prop({ type: [ActivityLog], default: [] })
  activityLog?: ActivityLog[];

  @Prop({ type: [LoginHistory], default: [] })
  loginHistory?: LoginHistory[];

  @Prop({
    required: true,
    default: 'clinic',
    enum: ['company', 'complex', 'clinic'],
  })
  plan: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
  companyId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Complex',
    required: false,
    default: null,
  })
  complexId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Clinic', required: false, default: null })
  clinicId: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  first_login: boolean;

  @Prop({ type: Boolean, default: false })
  Owner: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.post('save', function (error: any, doc: any, next: any) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already in use. Please enter a unique value for this field.`;
    next(new Error(message));
  } else {
    next(error);
  }
});
