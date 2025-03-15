import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Schema as MongooseSchema, Types} from 'mongoose';
export enum DayOfWeek {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday',
  }
  export class InsuranceCompany {
    @Prop({ required: true })
    companyName: string; // اسم الشركة
  
    @Prop({ required: true, unique: true })
    companyPhone: string; // هاتف الشركة
  
    @Prop({ required: true, unique: true })
    companyEmail: string; // إيميل الشركة
  }
  
  export class BankAccount {
    @Prop({ required: true })
    accountName: string; // اسم الحساب
  
    @Prop({ required: true, unique: true })
    swiftCode: string; // Swift Code
  
    @Prop({ required: true })
    bankName: string; // اسم البنك
  
    @Prop()
    bankAddress: string; // عنوان البنك (اختياري)
  
    @Prop({ required: true, unique: true })
    accountNumber: string; // رقم الحساب
  }
  
  export class CommercialRecord {
    @Prop({ required: true, unique: true })
    recordNumber: string; // رقم السجل
  
    @Prop({ required: true, type: Date })
    grantDate: Date; // تاريخ المنح
  
    @Prop({ required: true, type: Date })
    issueDate: Date; // تاريخ الإصدار
  
    @Prop({ required: true, type: Date })
    expirationDate: Date; // الصلاحية
  
    @Prop({ required: true, unique: true })
    taxNumber: string; // الرقم الضريبي
  }
  
  export class Holiday {
    @Prop({ required: true })
    name: string;
  
    @Prop({ required: true, type: Date })
    date: Date;
  
    @Prop({ required: true })
    reason: string;
  }
  
  export class ContactInfo {
    @Prop({ required: true })
    value: string;
  
    @Prop({ required: true, enum: ['email', 'phone', 'socialMedia'] })
    type: string;
  
    @Prop({ required: true })
    isPublic: boolean;
  
    @Prop({ required: false })
    subType: string; //  العمل  او المكتب أو الشخصي
  }
  export class Specialization {
    @Prop({ required: true })
    name: string;
  
    @Prop({ required: true })
    description: string;
  }
  export class WorkingDays  {
    @Prop({
      required: true,
      enum: DayOfWeek,
    })
    name: DayOfWeek;
  
    @Prop({ required: true })
    startOfWorkingTime: string;
  
    @Prop({ required: true })
    endOfWorkingTime: string;
  }
export type ClinicDocument = Clinic & Document;

@Schema({ timestamps: true })
export class Clinic { 
    @Prop({ required: true })
    name: string;
  
    @Prop()
    intro: string;
  
    @Prop({ type: Date })
    yearOfEstablishment: Date;
  
    @Prop()
    address: string;
  
    @Prop()
    logo: string;
  
    @Prop()
    vision: string;
  
    @Prop()
    details: string;
  
    @Prop({ type: [ContactInfo], default: [] })
    ContactInfos: ContactInfo[];
  
    @Prop({ type: [Holiday], default: [] })
    holidays: Holiday[];
  
    @Prop({ type: [Specialization], default: [] })
    specialization: Specialization[];
  
    @Prop({ type: [WorkingDays], default: [] })
    workingDays: WorkingDays[];
  
    @Prop({ type: [BankAccount], default: [] })
    bankAccount: BankAccount[];
  
    @Prop({ type: [InsuranceCompany], default: [] })
    insuranceCompany: InsuranceCompany[];
  
    @Prop({ type: CommercialRecord })
    commercialRecord: CommercialRecord;
  
    @Prop({ type: Object })
    locationGoogl: { x: number; y: number };

    @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
    departmentId?: Types.ObjectId;  // القسم الذي تتبع له العيادة (إذا وجدت)

}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);
