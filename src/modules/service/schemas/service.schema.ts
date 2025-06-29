import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ServiceSession } from 'src/common/utils/helper.dto';

@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({ required: true, unique: false })
  name: string;

  @Prop({
    required: true,
    enum: [
      'Consultation',
      'Medical Examination',
      'Medical Procedure',
      'Therapy Session',
      'Dental Session',
      'Laboratory Test',
      'Radiology',
      'Vaccination',
      'Cosmetic Procedure',
      'Wellness or Counseling',
      'Reevaluation',
      'Emergency Procedure',
    ],
  })
  category: string;

  @Prop({ required: true, type: Number, unique: false })
  sessionsNumber: number;

  @Prop({ required: false, type: [ServiceSession] })
  session: ServiceSession[];

  @Prop({ required: false, type: [Types.ObjectId], ref: 'Employee' })
  doctor: Types.ObjectId[];

  @Prop({ required: false, type: [Types.ObjectId], ref: 'Clinic' })
  clinics: Types.ObjectId[];

  @Prop({ required: false, type: Types.ObjectId, ref: 'Complex' })
  complex: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
