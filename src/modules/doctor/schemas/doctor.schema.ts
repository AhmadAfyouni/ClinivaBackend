import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {WorkingHours} from "../../../common/utlis/helper";

export type DoctorDocument = Doctor & Document;


@Schema({ timestamps: true })
export class Doctor {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;  // اسم الطبيب

    @Prop()
    phone: string;  // رقم هاتف الطبيب

    @Prop({ type: [String], default: [] })
    specialties: string[];  // تخصصات الطبيب

    @Prop({ type: [WorkingHours], default: [] })
    workingHours: WorkingHours[];
    @Prop()
    birthdate?: Date;

    @Prop()
    gender?: string; // Example: "Male", "Female", "Other"

    @Prop()
    identity?: string; // National ID or Passport Number

    @Prop()
    nationality?: string;

    @Prop()
    marital_status?: string; // Example: "Single", "Married", "Divorced", "Widowed"

    @Prop()
    number_children?: number;

    @Prop()
    blood_type?: string; // Example: "A+", "B-", "O+", etc.

    @Prop()
    height?: number; // in cm

    @Prop()
    weight?: number; // in kg

    @Prop()
    notes?: string;

    @Prop({ unique: true })
    email?: string;

    @Prop({ type: [String], default: [] })
    Languages?: string[];

    @Prop()
    Evaluation?: number; // Example: 1-10 rating system

}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
