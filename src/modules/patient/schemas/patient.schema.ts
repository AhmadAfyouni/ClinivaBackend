import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

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
    email?: string;

    @Prop()
    address?: string;

    @Prop()
    notes?: string;

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
