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

export type ClinicCollectionDocument = ClinicCollection & Document;

@Schema({timestamps: true})
export class ClinicCollection {
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

    @Prop({type: Types.ObjectId, ref: 'Company', default: null})
    companyId?: Types.ObjectId;

}

export const ClinicCollectionSchema = SchemaFactory.createForClass(ClinicCollection);
