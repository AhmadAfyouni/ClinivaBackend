import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true }) // إضافة حقول createdAt و updatedAt تلقائيًا
export class Patient {
    @Prop({ required: true })
    name: string;  // اسم المريض

    @Prop({ required: true })
    phone: string;  // رقم هاتف المريض (للتواصل)

    @Prop({ required: true })
    dateOfBirth: Date;  // تاريخ الميلاد

    @Prop({ required: true, enum: ['male', 'female'] })
    gender: string;  // الجنس

    @Prop()
    email?: string;  // البريد الإلكتروني للمريض (اختياري)

    @Prop()
    address?: string;  // عنوان المريض (اختياري)

    @Prop()
    notes?: string; // ملاحظات إضافية عن المريض

    @Prop({
        type: {
            insuranceProvider: { type: String, required: false }, // اسم شركة التأمين
            insuranceNumber: { type: String, required: false }, // رقم بطاقة التأمين
            coveragePercentage: { type: Number, required: false, min: 0, max: 100 }, // نسبة التغطية (مثلاً 80%)
            expiryDate: { type: Date, required: false }, // تاريخ انتهاء صلاحية التأمين
            insuranceType: { type: String, required: false, enum: ['private', 'governmental', 'corporate'] }, // نوع التأمين
        },
        default: null
    })
    insurance?: {
        insuranceProvider?: string;
        insuranceNumber?: string;
        coveragePercentage?: number;
        expiryDate?: Date;
        insuranceType?: string;
    };
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
