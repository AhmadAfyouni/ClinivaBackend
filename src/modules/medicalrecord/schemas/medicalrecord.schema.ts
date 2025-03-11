import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MedicalRecordDocument = MedicalRecord & Document;

@Schema({ timestamps: true })
export class MedicalRecord {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
    appointment: Types.ObjectId;  // مرجع إلى الموعد، يحتوي على جميع البيانات المرتبطة

    @Prop({ required: true })
    diagnosis: string;  // التشخيص الطبي

    @Prop({ type: [String], default: [] })
    medications: string[];  // قائمة الأدوية الموصوفة

    @Prop({ type: [String], default: [] })
    labTests: string[];  // التحاليل المطلوبة

    @Prop({ default: '' })
    notes?: string;  // ملاحظات إضافية من الطبيب

    @Prop({ enum: ['draft', 'finalized'], default: 'draft' })
    recordStatus: string;  // حالة السجل (مسودة أو نهائي)
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
