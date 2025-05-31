import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContactInfo, WorkingHours } from '../../../common/utils/helper';
import {
  BankAccountDTO,
  CommercialRecordDTO,
  HolidayDTO,
  InsuranceDTO,
  OnlinePaymentMethodDTO,
} from 'src/common/utils';

export type ComplexDocument = Complex & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Complex {
  _id: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  name: string;

  @Prop()
  overview?: string;

  @Prop({ type: Date })
  yearOfEstablishment?: Date;

  @Prop()
  address: string;

  @Prop()
  logo?: string;

  @Prop()
  vision?: string;

  @Prop()
  goals?: string;

  @Prop()
  patientCapacity: number;

  @Prop({ type: String, required: false })
  policies: string;

  @Prop({ type: [ContactInfo], default: [] })
  contactInfos: ContactInfo[];

  @Prop({ type: [HolidayDTO], default: [] })
  holidays: HolidayDTO[];

  @Prop({ type: [WorkingHours], default: [] })
  workingDays: WorkingHours[];

  @Prop({ type: [OnlinePaymentMethodDTO], default: [] })
  onlinePaymentMethods: OnlinePaymentMethodDTO[];

  @Prop({ type: [BankAccountDTO], default: [] })
  bankAccount: BankAccountDTO[];

  @Prop({ type: [InsuranceDTO], default: [] })
  insuranceCompany: InsuranceDTO[];

  @Prop({ type: CommercialRecordDTO })
  commercialRecord: CommercialRecordDTO;

  @Prop({ type: { x: Number, y: Number } })
  locationGoogl: { x: number; y: number };

  @Prop({ type: Types.ObjectId, ref: 'Company', default: null })
  companyId?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Specialization', required: true })
  specializations: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  PIC: Types.ObjectId;

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ required: true })
  email: string;

  @Prop()
  website?: string;

  @Prop()
  stateProvince: string;

  @Prop()
  postalZipCode: string;

  @Prop({ required: true })
  country: string;
}

export const ClinicCollectionSchema = SchemaFactory.createForClass(Complex);
