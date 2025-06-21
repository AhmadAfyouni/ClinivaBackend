import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContactInfo, WorkingHours } from '../../../common/utils/helper';
import { ApiProperty } from '@nestjs/swagger';
import { BankAccountDTO, GeneralInfo, HolidayDTO } from 'src/common/utils';

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

  @Prop({ type: GeneralInfo })
  generalInfo: GeneralInfo;

  @Prop({ required: true, type: [Types.ObjectId], ref: 'Service' })
  services: Types.ObjectId[];

  @Prop({ type: [HolidayDTO], default: [] })
  holidays?: HolidayDTO[];

  @Prop({ required: true })
  name: string;

  @Prop({ type: [WorkingHours], default: [] })
  WorkingHours?: WorkingHours[];

  @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
  departmentId?: Types.ObjectId;

  @ApiProperty({
    description: 'Department PIC ID',
    example: '60f7c7b84f1a2c001c8b4567',
    required: false,
  })
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: false })
  PIC: Types.ObjectId;

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ required: false })
  Description?: string;

  @Prop({ required: true })
  PatientCapacity: number;

  @Prop({ required: true })
  DoctorsCapacity: number;

  @Prop({ required: true })
  StaffMembersCapacity: number;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);

ClinicSchema.set('toObject', { virtuals: true });
ClinicSchema.set('toJSON', { virtuals: true });
