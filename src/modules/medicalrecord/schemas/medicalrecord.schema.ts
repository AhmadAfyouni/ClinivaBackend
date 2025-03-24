import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Medication } from '../../../common/utlis/helper';

export type MedicalRecordDocument = MedicalRecord & Document;

@Schema({ timestamps: true })
export class MedicalRecord {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
  appointment: Types.ObjectId;  // مرجع إلى الموعد، يحتوي على جميع البيانات المرتبطة

  @Prop({ required: true })
  diagnosis: string;  // التشخيص الطبي

  @Prop()
  Symptoms?: string;  //  الاعراض

  @Prop()
  treatmentPlan?: string;  //  خطة العلاج

  @Prop({ type: [Medication], default: [] })
  medications: Medication[]; // قائمة الأدوية مع الجرعة

//     @Prop({enum: ['draft', 'finalized'], default: 'draft'})
//     recordStatus: string;  // حالة السجل (مسودة أو نهائي)

    
    // @Prop({type: Number, min: 1, max: 5})
    // patientRating?: number;  // تقييم المريض للطبيب (1-5 نجوم)

    // @Prop({default: ''})
    // patientFeedback?: string;  // ملاحظات المريض عن الخدمة

    @Prop({
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        required: true,
      })
    severityLevel: string;


    @Prop()
    startTime?: Date;

    @Prop()
    endTime?: Date;

    @Prop({ type: Date, required: false })
    nextAppointmentDate?: Date;

    @Prop({
        type: String,
        enum: ['routine check-up', 'follow-up', 'emergency', 'consultation', 'treatment'],
        required: true,
    })
    visitType: string;
  @Prop({ type: [String], default: [] })
  labTests: string[];  // التحاليل المطلوبة

  @Prop({ default: '' })
  notes?: string;  // ملاحظات إضافية من الطبيب

  @Prop({ enum: ['draft', 'finalized'], default: 'draft' })
  recordStatus: string;  // حالة السجل (مسودة أو نهائي)
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
