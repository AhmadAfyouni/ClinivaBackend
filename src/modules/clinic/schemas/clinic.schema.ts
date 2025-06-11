import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContactInfo, WorkingHours } from '../../../common/utils/helper';
import { ApiProperty } from '@nestjs/swagger';
import { BankAccountDTO, HolidayDTO } from 'src/common/utils';

export type ClinicDocument = Clinic & Document & { _patientCount?: number };

@Schema({ timestamps: true })
export class Clinic {
  _id: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  AverageDurationOfVisit: number;

  @Prop()
  logo?: string;

  @Prop({ type: [ContactInfo], default: [] })
  contactInfos: ContactInfo[];

  @Prop({ type: [HolidayDTO], default: [] })
  holidays?: HolidayDTO[];

  @Prop({ required: true })
  name: string;

  @Prop({ type: [WorkingHours], default: [] })
  WorkingHours?: WorkingHours[];

  @Prop({ type: [BankAccountDTO], default: [] })
  bankAccount: BankAccountDTO[];

  @Prop({ type: Object })
  locationGoogl: { x: number; y: number };

  @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
  departmentId?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Specialization', required: true })
  specializations: Types.ObjectId[];

  @ApiProperty({
    description: 'Department PIC ID',
    example: '60f7c7b84f1a2c001c8b4567',
    required: true,
  })
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  PIC: Types.ObjectId;

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);

ClinicSchema.set('toObject', { virtuals: true });
ClinicSchema.set('toJSON', { virtuals: true });
