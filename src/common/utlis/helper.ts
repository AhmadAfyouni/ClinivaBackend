import { Prop } from '@nestjs/mongoose';

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export class Shift {
  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;
}

export class WorkingHours {
  @Prop({
    required: true,
    enum: DayOfWeek,
  })
  day: string;

  @Prop({
    required: true,
    type: Shift,
    default: { startTime: '08:00', endTime: '13:00' },
  })
  shift1: Shift;

  @Prop({
    required: true,
    type: Shift,
    default: { startTime: '14:00', endTime: '19:00' },
  })
  shift2: Shift;
}

export class InsuranceCompany {
  @Prop({ required: true })
  companyName: string;

  @Prop({ type: [String], required: true })
  coveredServices: string[];

  @Prop({ required: true })
  termsAndConditions: string;

  @Prop({ type: [String], default: [] })
  coverageDetails: string[];

  @Prop({ required: true, min: 0, max: 100 })
  coveragePercentage: number; // نسبة التغطية %

  @Prop({ required: true })
  contractStartDate: Date; // تاريخ بداية العقد

  @Prop({ required: true })
  contractEndDate: Date; // تاريخ انتهاء العقد

  @Prop({ required: true })
  contactPerson: string; // شخص الاتصال

  @Prop({ required: true })
  companyPhone: string; // هاتف الشركة

  @Prop({ required: true })
  companyEmail: string; // إيميل الشركة

  @Prop()
  address?: string; // عنوان الشركة

  @Prop({ default: true })
  isActive: boolean;
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

  @Prop({
    required: true, //enum: ['savings', 'checking', 'business']
  })
  accountType: string; // نوع الحساب (مدخرات، جاري، تجاري)

  @Prop({ default: true })
  isActive: boolean;
}

export class CashBox {
  @Prop({ required: true })
  name: string; // اسم الصندوق

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  location: string; // الموقع

  @Prop({ required: true })
  currency: string; // العملة

  @Prop({ required: true })
  pic: string; // المسؤول الرئيسي (PIC)

  @Prop({ default: 0 })
  totalBalance: number; // الرصيد الإجمالي

  @Prop()
  createdBy: string; // أنشئ بواسطة

  @Prop({
    type: [{ date: Date, amount: Number, description: String }],
    default: [],
  })
  transactionHistory: { date: Date; amount: number; description: string }[]; // سجل المعاملات
}

export class OnlinePaymentMethod {
  @Prop({ required: true })
  companyName: string; // اسم الشركة

  @Prop({ required: true, enum: ['deposit', 'withdrawal', 'transfer'] })
  transactionType: string; // نوع المعاملة (إيداع، سحب، تحويل)

  @Prop({
    required: true,
    enum: ['credit_card', 'bank_transfer', 'digital_wallet'],
  })
  type: string; // نوع الدفع (بطاقة ائتمان، تحويل بنكي، محفظة رقمية)

  @Prop({ type: [String], required: true })
  supportedCurrencies: string[]; // العملات المدعومة

  @Prop({ required: true, min: 0 })
  processingFees: number; // رسوم المعالجة

  @Prop({ type: [String], default: [] })
  securityFeatures: string[]; // ميزات الأمان

  @Prop({ default: true })
  isActive: boolean;
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
  @Prop({ type: String })
  phone_numbers: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  website: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: { lat: String, lng: String } })
  google_maps_location: { lat: string; lng: string };

  @Prop({ type: String })
  linkedin: string;

  @Prop({ type: String })
  twitter: string;

  @Prop({ type: String })
  facebook: string;

  @Prop({ type: String })
  youtube: string;
}

export class Insurance {
  @Prop({ type: String, required: true })
  insuranceProvider: string;

  @Prop({ type: String, required: true })
  insuranceNumber: string;

  @Prop({ type: Number, min: 0, max: 100, required: true })
  coveragePercentage: number;

  @Prop({ type: Date, required: true })
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

  @Prop({ required: true })
  startOfWorkingTime: string;

  @Prop({ required: true })
  endOfWorkingTime: string;
}

export class Vacation {
  @Prop({ required: true, type: Date })
  leaveStartDate: Date;

  @Prop({ required: true, type: Date })
  leaveEndDate: Date;

  @Prop({ required: true, enum: ['Vacation', 'Sick Leave', 'Emergency'] })
  leaveType: string;

  @Prop({ required: true, enum: ['Approved', 'Pending'], default: 'Pending' })
  status: string;
}

export class Medication {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dosage: string;
}

export class BreakTime {
  @Prop({ required: true, enum: DayOfWeek })
  day: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;
}

export class MedicalTestResult {
  @Prop({ required: true, type: String })
  filePath: string;
}

export class ActivityLog {
  @Prop({ type: Date, required: true })
  activityDate: Date;

  @Prop({ type: String, required: true })
  description: string;
}

export class LoginHistory {
  @Prop({ type: Date, required: true })
  loginDate: Date;

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: String, required: true })
  device: string;
}
