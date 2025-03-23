import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContactInfo, Vacation, WorkingHours } from '../../../common/utlis/helper';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [ContactInfo], default: [] })
  ContactInfos: ContactInfo[];

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
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    default: 'Single',
  })
  marital_status?: string;

  @Prop({ required: true })
  number_children?: number;


  @Prop()
  notes?: string;

  // @Prop()
  // email?: string;

  @Prop({ required: true })
  address?: string;


  @Prop({})
  professional_experience: string;

  @Prop({ type: [String], default: [] })
  specialties: string[];

  @Prop({ type: [String], default: [] })
  Languages?: string[];

  @Prop({ type: [WorkingHours], default: [] })
  workingHours: WorkingHours[];

  @Prop()
  evaluation?: number;

  @Prop({
    type: String,
    enum: ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Emloyee', 'Other'],
    required: true,
  })
  employeeType: string;

  @Prop({ type: [Vacation], default: [] })
  vacationRecords: Vacation[]; // سجل الإجازات

}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
