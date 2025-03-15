import {Prop} from "@nestjs/mongoose";

class TimeSlot {
    @Prop({required: true})
    startTime: string; // وقت بدء العمل (مثال: "04:00 PM")

    @Prop({required: true})
    endTime: string; // وقت انتهاء العمل (مثال: "08:00 PM")
}

export class WorkingHours {
    @Prop({required: true, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']})
    day: string; // اليوم

    @Prop({type: [TimeSlot], default: []})
    timeSlots: TimeSlot[]; // قائمة الفترات الزمنية لكل يوم
}

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
    @Prop({required: true})
    companyName: string; // اسم الشركة

    @Prop({required: true, unique: true})
    companyPhone: string; // هاتف الشركة

    @Prop({required: true, unique: true})
    companyEmail: string; // إيميل الشركة
}

export class BankAccount {
    @Prop({required: true})
    accountName: string; // اسم الحساب

    @Prop({required: true, unique: true})
    swiftCode: string; // Swift Code

    @Prop({required: true})
    bankName: string; // اسم البنك

    @Prop()
    bankAddress: string; // عنوان البنك (اختياري)

    @Prop({required: true, unique: true})
    accountNumber: string; // رقم الحساب
}

export class CommercialRecord {
    @Prop({required: true, unique: true})
    recordNumber: string; // رقم السجل

    @Prop({required: true, type: Date})
    grantDate: Date; // تاريخ المنح

    @Prop({required: true, type: Date})
    issueDate: Date; // تاريخ الإصدار

    @Prop({required: true, type: Date})
    expirationDate: Date; // الصلاحية

    @Prop({required: true, unique: true})
    taxNumber: string; // الرقم الضريبي
}

export class Holiday {
    @Prop({required: true})
    name: string;

    @Prop({required: true, type: Date})
    date: Date;

    @Prop({required: true})
    reason: string;
}

export class ContactInfo {

    @Prop({required: true, enum: ['email', 'phone', 'socialMedia']})
    type: string;

    @Prop({required: true})
    value: string;


    @Prop({required: true})
    isPublic: boolean;

    @Prop({required: false})
    subType: string; //  العمل  او المكتب أو الشخصي
}

export class Specialization {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;
}

export class Insurance {
    @Prop({type: String, required: true})
    insuranceProvider: string;

    @Prop({type: String, required: true})
    insuranceNumber: string;

    @Prop({type: Number, min: 0, max: 100, required: true})
    coveragePercentage: number;

    @Prop({type: Date, required: true})
    expiryDate: Date;

    @Prop({
        type: String,
        enum: ['private', 'governmental', 'corporate'],
        required: true,
    })
    insuranceType: string;
}


export class WorkingDays {
    @Prop({
        required: true,
        enum: DayOfWeek,
    })
    name: DayOfWeek;

    @Prop({required: true})
    startOfWorkingTime: string;

    @Prop({required: true})
    endOfWorkingTime: string;
}