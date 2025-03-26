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

export class WorkingHours {
  @Prop({ required: true, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] })
  day: string; // اليوم

  @Prop({ required: true })
  startTime: string; // وقت بدء العمل (مثال: "04:00 PM")

  @Prop({ required: true })
  endTime: string; // وقت انتهاء العمل (مثال: "08:00 PM")
}

export class InsuranceCompany {
  @Prop({ required: true })
  companyName: string; // اسم الشركة

    @Prop({ type: [String], required: true })
    coveredServices: string[]; // الخدمات المغطاة

    @Prop({ required: true })
    termsAndConditions: string; // الشروط والأحكام

    @Prop({ type: [String], default: [] })
    coverageDetails: string[]; // تفاصيل التغطية (قائمة ذكية)

    @Prop({ required: true, min: 0, max: 100 })
    coveragePercentage: number; // نسبة التغطية %

    @Prop({ required: true })
    contractStartDate: Date; // تاريخ بداية العقد

    @Prop({ required: true })
    contractEndDate: Date; // تاريخ انتهاء العقد

    @Prop({ required: true })
    contactPerson: string; // شخص الاتصال

    @Prop({required: true, })
    companyPhone: string; // هاتف الشركة

    @Prop({required: true,})
    companyEmail: string; // إيميل الشركة
  
    @Prop()
    address?: string; // عنوان الشركة

    @Prop({default: true})
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

    @Prop({required: true, unique: true})
    accountNumber: string; // رقم الحساب

    @Prop({ required: true, //enum: ['savings', 'checking', 'business']

     })
    accountType: string; // نوع الحساب (مدخرات، جاري، تجاري)

    @Prop({default: true})
    isActive: boolean;

}
export class CashBox {
    @Prop({ required: true })
    name: string; // اسم الصندوق

    @Prop({default: true})
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

    @Prop({ type: [{ date: Date, amount: Number, description: String }], default: [] })
    transactionHistory: { date: Date; amount: number; description: string }[]; // سجل المعاملات
}







export class OnlinePaymentMethod {
    @Prop({ required: true })
    companyName: string; // اسم الشركة

    @Prop({ required: true, enum: ['deposit', 'withdrawal', 'transfer'] })
    transactionType: string; // نوع المعاملة (إيداع، سحب، تحويل)

    @Prop({ required: true, enum: ['credit_card', 'bank_transfer', 'digital_wallet'] })
    type: string; // نوع الدفع (بطاقة ائتمان، تحويل بنكي، محفظة رقمية)

    @Prop({ type: [String], required: true })
    supportedCurrencies: string[]; // العملات المدعومة

    @Prop({ required: true, min: 0 })
    processingFees: number; // رسوم المعالجة

    @Prop({ type: [String], default: [] })
    securityFeatures: string[]; // ميزات الأمان

    @Prop({default: true})
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

  @Prop({ required: true, enum: ['email', 'phone', 'socialMedia', 'CompanyWebsite'] })
  type: string;

  @Prop({ required: true })
  value: string;


  @Prop({ required: true })
  isPublic: boolean;

  @Prop({ required: false })
  subType: string; //  العمل  او المكتب أو الشخصي
}
/*
export class Specialization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  requiredEquipment: [String]; // المعدات المطلوبة للتخصص

  @Prop({ required: true })
  requiredStaff: [String]; // الموظفين المطلوبين للتخصص

  @Prop({ required: true })
  medicalProcedures: [String]; // الإجراءات الطبية المتعلقة بالتخصص

  @Prop({ required: true })
  certificationRequirements: string; // متطلبات الشهادات للتخصص

  @Prop({ required: true })
  isActive: string; //اذا فعال

}*/

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

  leaveStartDate: Date; // تاريخ بدء الإجازة

  @Prop({ required: true, type: Date })

  leaveEndDate: Date; // تاريخ انتهاء الإجازة

  @Prop({ required: true, enum: ['Vacation', 'Sick Leave', 'Emergency'] })
  leaveType: string; // نوع الإجازة (عطلة/إجازة مرضية/طارئة)

  @Prop({ required: true, enum: ['Approved', 'Pending'], default: 'Pending' })
  status: string; // الحالة (موافقة/معلقة)
}

export class Medication {
    @Prop({ required: true, })
    name: string;
  
    @Prop({ required: true, })
    dosage: string;
  }

  export class BreakTime {
    @Prop({ required: true })
    startTime: string; // 
  
    @Prop({ required: true })
    endTime: string; // 
  }

  export class MedicalTestResult {
  
 /*   @Prop({ required: true, type: String })
    fileType: string; // نوع الملف (PDF، JPEG، DICOM)
  */
    @Prop({ required: true, type: String })
    filePath: string; // مسار الملف المحمل في النظام
  /*
    @Prop({ required: true, type: String })
    testType: string; // نوع الفحص (مثل فحص دم، فحص أشعة، إلخ)
  
    @Prop({ required: true, type: Date })
    testDate: Date; // تاريخ الفحص
  
    @Prop({ required: true, type: String })
    labName: string; // اسم المختبر
    */
  }


  export class Certificate {
    
    @Prop({ required: true })
    certificateName: string; // اسم الشهادة
  
    @Prop({ required: true })
    institution: string; // الجهة المانحة للشهادة
  
    @Prop({ required: true })
    issueDate: Date; // تاريخ إصدار الشهادة
  
    @Prop()
    expiryDate?: Date; // تاريخ انتهاء الشهادة (اختياري)
  
    @Prop({ required: true })
    certificateImageUrl: string; // رابط الصورة المخزنة للشهادة
  
    @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
    status: string; // حالة التحقق من الشهادة
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