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
import { User } from 'src/modules/user/schemas/user.schema';

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
    goals?: string;

    @Prop()
    patientCapacity: number;  // قدرة استيعاب المرضى

    @Prop({ type: String, required: false })
    policies: string;  //  حقل السياسات العامة

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
ClinicCollectionSchema.virtual('users', {
  ref: 'User',  // النموذج المرتبط (User)
  localField: '_id',  // الحقل المحلي في ClinicCollection
  foreignField: 'clinicCollectionId',  // الحقل في User الذي يحتوي على المرجع (clinicCollectionId)
  //justOne: false,  // نريد جلب أكثر من مستخدم إذا كانوا مرتبطين
});