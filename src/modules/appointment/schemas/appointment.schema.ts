import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({timestamps: true})
export class Appointment {
    _id: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Patient', required: true})
    patient: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Clinic', required: true})
    clinic: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Employee', required: true})
    doctor: Types.ObjectId;

    @Prop({required: true})
    datetime: Date;

    @Prop()
    startTime?: Date;

    @Prop()
    endTime?: Date;

    @Prop()
    reason?: string;

    @Prop({enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled'})
    status: string;

    @Prop({type: Number, min: 1, max: 5})
    patientRating?: number;  // تقييم المريض للطبيب (1-5 نجوم)

    @Prop({default: ''})
    patientFeedback?: string;  // ملاحظات المريض عن الخدمة
    
    @Prop()
    cancellationReason?: string; // سبب الإلغاء في حالة كان status = 'cancelled'
  
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
