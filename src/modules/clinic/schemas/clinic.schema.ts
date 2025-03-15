import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {
    BankAccount,
    CommercialRecord,
    ContactInfo,
    Holiday,
    InsuranceCompany,
    Specialization,
    WorkingHours
} from "../../../common/utlis/helper";

export type ClinicDocument = Clinic & Document;

@Schema({timestamps: true})
export class Clinic {
    _id: Types.ObjectId;

    @Prop({required: true})
    name: string;

    @Prop()
    introduction?: string;

    @Prop({type: Date})
    yearOfEstablishment?: Date;

    @Prop()
    address: string;

    @Prop()
    logo?: string;

    @Prop()
    vision?: string;

    @Prop()
    details?: string;

    @Prop({type: [ContactInfo], default: []})
    ContactInfos: ContactInfo[];

    @Prop({type: [Holiday], default: []})
    holidays?: Holiday[];

    @Prop({type: [Specialization], default: []})
    specialization?: Specialization[];

    @Prop({type: [WorkingHours], default: []})
    WorkingHours?: WorkingHours[];

    @Prop({type: [BankAccount], default: []})
    bankAccount: BankAccount[];

    @Prop({type: [InsuranceCompany], default: []})
    insuranceCompany: InsuranceCompany[];

    @Prop({type: CommercialRecord})
    commercialRecord: CommercialRecord;

    @Prop({type: Object})
    locationGoogl: { x: number; y: number };

    @Prop({type: Types.ObjectId, ref: 'Department', default: null})
    departmentId?: Types.ObjectId;  // القسم الذي تتبع له العيادة (إذا وجدت)

}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);
