import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Medication } from '../../../common/utlis/helper';

export type MedicalRecordDocument = MedicalRecord & Document;

@Schema({ timestamps: true })
export class MedicalRecord {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment', default: null })
  appointment: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Patient', default: null })
  patient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  doctor: Types.ObjectId;

  @Prop({ required: true })
  diagnosis: string;

  @Prop()
  Symptoms?: string;

  @Prop()
  treatmentPlan?: string;

  @Prop({ type: [Medication], default: [] })
  medications: Medication[];

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
    enum: [
      'routine check-up',
      'follow-up',
      'emergency',
      'consultation',
      'treatment',
    ],
    required: true,
  })
  visitType: string;
  @Prop({ type: [String], default: [] })
  labTests: string[];

  @Prop({ default: '' })
  notes?: string;

  @Prop({ enum: ['draft', 'finalized'], default: 'draft' })
  recordStatus: string;

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
