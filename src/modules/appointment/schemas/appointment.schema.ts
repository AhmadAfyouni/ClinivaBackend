import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Clinic', required: true })
  clinic: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Employee', required: false})
    doctor: Types.ObjectId;

    @Prop({required: true})
    datetime: Date;

    @Prop()
    reason: string;
   
    @Prop({enum: ['scheduled', 'completed', 'cancelled','Rescheduled'], default: 'scheduled'})
    status: string;
 
    @Prop()
    cancellationReason?: string; // سبب الإلغاء في حالة كان status = 'cancelled'
  
  @Prop({ type: Date })
  cancellationDate: Date;  // تاريخ الإلغاء
  
    @Prop({ type: String, enum: ['examination', 'follow-up', 'consultation', 'session', 'general checkup', 'monitoring'], required: true })
  appointmentType: string;  // نوع الموعد

  @Prop({ type: String, enum: ['routine', 'urgent', 'emergency'], required: true })
  priorityLevel: string;  // مستوى الأهمية

  @Prop({ type: String, default: '' })
  notes?: string;  // ملاحظات إضافية

  
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
