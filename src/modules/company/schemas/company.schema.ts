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

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  _id: Types.ObjectId;

  @Prop({ required: true })
  nameTrade: string;

  @Prop({ required: true })
  nameLegal: string;

  @Prop({ required: true })
  ceo: string;

  @Prop()
  overview: string;

  @Prop({ type: Date })
  yearOfEstablishment: Date;

  @Prop()
  address: string;

  @Prop()
  logo: string;

  @Prop()
  vision: string;

  @Prop({ type: [ContactInfo], default: [] })
  contactInfos: ContactInfo[];
  // //
  //     @Prop({type: [Holiday], default: []})
  //     holidays: Holiday[];
  // //
  //     @Prop({type: [WorkingHours], default: []})
  //     workingDays: WorkingHours[];
  @Prop()
  goals: string;

  @Prop({ type: [CashBox], default: [] })
  cashBoxes: CashBox[];

  @Prop({ type: [OnlinePaymentMethod], default: [] })
  onlinePaymentMethods: OnlinePaymentMethod[];

  @Prop({ type: [InsuranceCompany], default: [] })
  insuranceCompany: InsuranceCompany[];
  @Prop({ type: [BankAccount], default: [] })
  bankAccount: BankAccount[];

  @Prop({ type: CommercialRecord })
  commercialRecord: CommercialRecord;

  @Prop({ type: Object })
  locationGoogl: { x: number; y: number };
  @Prop({ required: true, default: 'Key_member' })
  Key_member: string; // العضو الرئيسي

  @Prop({ required: true, default: ' Founder' })
  Founder: string; // المؤسس

  @Prop({ required: true, default: 'Executives' })
  Executives: string; // التنفيذيون
}

export const CompanySchema = SchemaFactory.createForClass(Company);
