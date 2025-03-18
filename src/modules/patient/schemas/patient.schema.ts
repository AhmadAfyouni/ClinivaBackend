import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {ContactInfo, Insurance} from "../../../common/utlis/helper";


export type PatientDocument = Patient & Document;

@Schema({timestamps: true})
export class Patient {
    _id: Types.ObjectId;

    @Prop({required: true})
    name: string;

    @Prop({type: [ContactInfo], default: []})
    ContactInfos: ContactInfo[];

    @Prop({required: true})
    dateOfBirth: Date;

    @Prop({required: true, enum: ['male', 'female']})
    gender: string;

    @Prop({required: true, unique: true})
    identity?: string; // National ID or Passport

    @Prop({required: true})
    nationality?: string;

    @Prop()
    image?: string;

    @Prop({
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed'], // القيم المسموحة فقط
        default: 'Single', // القيمة الافتراضية
    })
    marital_status?: string;

    @Prop({required: true})
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

    // @Prop()
    // email?: string;

    @Prop({default: true})
    isActive: boolean;

    @Prop({required: true})
    address?: string;

    @Prop({
        type: {
            name: {type: String, required: true},
            phone: {type: String, required: true},
            relationToPatient: {type: String, required: true},
        },
        required: false, // Emergency contact is optional
    })
    emergencyContact?: {
        name: string;
        phone: string;
        relationToPatient: string;
    };

    @Prop({type: [{disease_name: String}], default: []})
    ChronicDiseases?: { disease_name: string }[];

    @Prop({type: [Insurance], default: []})
    insurances?: Insurance[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
