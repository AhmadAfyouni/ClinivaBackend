import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  BankAccount,
  CashBox,
  CommercialRecord,
  ContactInfo,
  Holiday,
  InsuranceCompany,
  OnlinePaymentMethod,
  WorkingHours,
} from '../../../common/utlis/helper';

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

  @Prop({ type: [Holiday], default: [] })
  holidays: Holiday[];

  @Prop({ type: [WorkingHours], default: [] })
  workingDays: WorkingHours[];

  @Prop({ type: [CashBox], default: [] })
  cashBoxes: CashBox[];

  @Prop({ type: [OnlinePaymentMethod], default: [] })
  onlinePaymentMethods: OnlinePaymentMethod[];
  @Prop({ type: [BankAccount], default: [] })
  bankAccount: BankAccount[];
  @Prop({ type: [InsuranceCompany], default: [] })
  insuranceCompany: InsuranceCompany[];

  @Prop({ type: CommercialRecord })
  commercialRecord: CommercialRecord;

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
