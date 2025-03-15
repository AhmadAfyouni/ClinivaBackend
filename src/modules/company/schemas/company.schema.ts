import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {
    BankAccount,
    CommercialRecord,
    ContactInfo,
    Holiday,
    InsuranceCompany,
    Specialization,
    WorkingHours
} from "../../../common/utlis/helper";

export type CompanyDocument = Company & Document;

@Schema({timestamps: true})
export class Company {
    @Prop({required: true})
    name: string;

    @Prop()
    intro: string;

    @Prop({type: Date})
    yearOfEstablishment: Date;

    @Prop()
    address: string;

    @Prop()
    logo: string;

    @Prop()
    vision: string;

    @Prop()
    details: string;

    @Prop({type: [ContactInfo], default: []})
    ContactInfos: ContactInfo[];

    @Prop({type: [Holiday], default: []})
    holidays: Holiday[];

    @Prop({type: [Specialization], default: []})
    specialization: Specialization[];

    @Prop({type: [WorkingHours], default: []})
    workingDays: WorkingHours[];

    @Prop({type: [BankAccount], default: []})
    bankAccount: BankAccount[];

    @Prop({type: [InsuranceCompany], default: []})
    insuranceCompany: InsuranceCompany[];

    @Prop({type: CommercialRecord})
    commercialRecord: CommercialRecord;

    @Prop({type: Object})
    locationGoogl: { x: number; y: number };

}

export const CompanySchema = SchemaFactory.createForClass(Company);
