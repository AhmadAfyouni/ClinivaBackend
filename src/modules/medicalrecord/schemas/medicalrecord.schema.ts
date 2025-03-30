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
  symptoms?: string;  //  الاعراض

  @Prop()
  treatmentPlan?: string;  //  خطة العلاج

  @Prop({ type: [Medication], default: [] })
  medications: Medication[]; // قائمة الأدوية مع الجرعة

  @Prop({ type: String, enum: ['ongoing', 'completed', 'referred'], required: true })
  treatmentStatus: string;  // حالة العلاج (جاري، مكتمل، محوّل)

  @Prop({ type: String, default: '' })
  notes?: string;  // ملاحظات إضافية حول العلاج
    
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



  @Prop({ type: [String], default: [] })
  labTests: string[];  // التحاليل المطلوبة

  // @Prop({ default: '' })
  // notes?: string;  // ملاحظات إضافية من الطبيب

  }

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
