import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkingHours } from "../../../common/utlis/helper";

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    jobTitle: string;

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

    @Prop()
    phone?: string;


    @Prop({ type: [WorkingHours], default: [] })
    workingHours?: WorkingHours[];

    @Prop({ type: [{ medication_name: String }], default: [] })
    RegularMedications?: { medication_name: string }[];

    @Prop({ type: [{ disease_name: String }], default: [] })
    ChronicDiseases?: { disease_name: string }[];

    @Prop()
    Professional_experience?: string;

    @Prop({ type: [String], default: [] })
    Languages?: string[];

    @Prop()
    Evaluation?: number; // Example: 1-10 rating system

    // Access Control Directly in Employee Schema
    @Prop({ type: Types.ObjectId, ref: 'Company', default: null })
    companyId?: Types.ObjectId; // Employee can belong to a company

    @Prop({ type: [Types.ObjectId], ref: 'ClinicCollection', default: [] })
    clinicCollectionId?: Types.ObjectId; // Employee can belong to multiple clinic collection

    @Prop({ type: [Types.ObjectId], ref: 'Department', default: [] })
    departmentId?: Types.ObjectId; // Employee can belong to multiple department

    @Prop({ type: [Types.ObjectId], ref: 'Clinic', default: [] })
    clinics: Types.ObjectId[]; // Employee can work in multiple clinics
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
