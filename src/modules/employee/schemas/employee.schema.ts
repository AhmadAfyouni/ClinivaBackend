import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { MongooseDocument } from 'src/common/utils/filter-sort.util';
import {
  ContactInfo,
  ActivityLog,
  BreakTime,
  LoginHistory,
  Vacation,
  WorkingHours,
} from 'src/common/utlis/helper';

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

  @Prop({ required: [true, 'Full name is required'], trim: true })
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
    enum: ['Admin', 'Doctor', 'Medical Staff', 'Staff'],
  })
  employeeType: string;

  @Prop({ type: ContactInfo, default: {} })
  contactInfos: ContactInfo;

  @Prop({ required: [true, 'Date of birth is required'] })
  dateOfBirth: Date;

  @Prop({ required: [true, 'Gender is required'], enum: ['male', 'female'] })
  gender: string;

  @Prop({
    required: [true, 'Identity is required'],
    unique: [true, 'Identity must be unique'],
    trim: true,
  })
  identity: string;

  @Prop({ required: [true, 'Nationality is required'], trim: true })
  nationality: string;

  @Prop()
  image?: string;

  @Prop({
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    default: 'Single',
  })
  marital_status?: string;

  @Prop({ required: true, min: [0, 'Number of children must be at least 0'] })
  number_children: number;

  @Prop()
  notes?: string;

  @Prop({ required: true, trim: true })
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
  employmentContract?: string;

  @Prop({ type: String, required: false })
  CV?: string;

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

  @Prop({ type: Types.ObjectId, ref: 'Complex', required: false })
  complexId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Clinic', required: false })
  clinicId: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  first_login: boolean;
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
