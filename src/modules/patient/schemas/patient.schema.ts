import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ required: true, enum: ['male', 'female'] })
    gender: string;

    @Prop()
    identity?: string; // National ID or Passport

    @Prop()
    nationality?: string;

    @Prop()
    marital_status?: string; // Example: "Single", "Married", "Divorced", etc.

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

    @Prop()
    email?: string;

    @Prop()
    address?: string;

    @Prop({
        type: {
            name: { type: String, required: true },
            phone: { type: String, required: true }
        },
        required: false, // Emergency contact is optional
    })
    emergencyContact?: {
        name: string;
        phone: string;
    };

    @Prop({
        type: [{
            insuranceProvider: { type: String, required: true },
            insuranceNumber: { type: String, required: true },
            coveragePercentage: { type: Number, min: 0, max: 100, required: true },
            expiryDate: { type: Date, required: true },
            insuranceType: { type: String, enum: ['private', 'governmental', 'corporate'], required: true }
        }],
        default: []
    })
    insurances: {
        insuranceProvider: string;
        insuranceNumber: string;
        coveragePercentage: number;
        expiryDate: Date;
        insuranceType: string;
    }[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
