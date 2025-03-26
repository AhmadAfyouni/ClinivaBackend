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

    WorkingHours
} from "../../../common/utlis/helper";

export type ClinicDocument = Clinic & Document;

@Schema({ timestamps: true })
export class Clinic {
  _id: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

    @Prop({required: true})
    AverageDurationOfVisit: number;
//
    @Prop()
    overview?: string;

    @Prop({type: Date})
    yearOfEstablishment?: Date;
//
    @Prop()
    address: string;
//
    @Prop()
    logo?: string;
//
    @Prop()
    vision?: string;
//
    @Prop()
    goals?: string;

    @Prop({type: [ContactInfo], default: []})
    contactInfos: ContactInfo[];
//
    @Prop({type: [Holiday], default: []})
    holidays?: Holiday[];
  @Prop({ required: true })
  name: string;



    @Prop({type: [WorkingHours], default: []})
    WorkingHours?: WorkingHours[];
//
    @Prop({type: [BankAccount], default: []})
    bankAccount: BankAccount[];
//
    @Prop({type: [InsuranceCompany], default: []})
    insuranceCompany: InsuranceCompany[];
//
    @Prop({type: [CashBox], default: []})
    cashBoxes: CashBox[];
//
    @Prop({type: [OnlinePaymentMethod], default: []})
    onlinePaymentMethods: OnlinePaymentMethod[];
//
    @Prop({type: CommercialRecord})
    commercialRecord: CommercialRecord;
//
    @Prop({type: Object})
    locationGoogl: { x: number; y: number };



  @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
  departmentId?: Types.ObjectId;  // القسم الذي تتبع له العيادة (إذا وجدت)

  @Prop({ type: [Types.ObjectId], ref: 'Specialization', required: true })
  specializations: Types.ObjectId[];  // قائمة بمعرفات الاختصاصات المرتبطة بالعيادة

}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);
