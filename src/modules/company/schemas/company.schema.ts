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
  name: string;

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
}

export const CompanySchema = SchemaFactory.createForClass(Company);
