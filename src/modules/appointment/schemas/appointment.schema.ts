import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
    patient: Types.ObjectId;  // مرجع إلى المريض

    @Prop({ type: Types.ObjectId, ref: 'Clinic', required: true })
    clinic: Types.ObjectId;  // العيادة التي تم فيها الموعد

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    doctor: Types.ObjectId;  // الطبيب الذي تم الحجز عنده

    @Prop({ required: true })
    datetime: Date;  // تاريخ ووقت الموعد المحدد للحجز

    @Prop()
    startTime?: Date;  // وقت بدء الموعد الفعلي

    @Prop()
    endTime?: Date;  // وقت انتهاء الموعد الفعلي

    @Prop()
    reason?: string;  // سبب الزيارة

    @Prop({ enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' })
    status: string;  // حالة الموعد

    @Prop({ type: Types.ObjectId, ref: 'MedicalRecord', default: null })
    medicalRecord?: Types.ObjectId;  // مرجع إلى السجل الطبي (يتم إنشاؤه بعد انتهاء الموعد)

    @Prop({ type: Number, min: 1, max: 5 })
    patientRating?: number;  // تقييم المريض للطبيب (1-5 نجوم)

    @Prop({ default: '' })
    patientFeedback?: string;  // ملاحظات المريض عن الخدمة
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
