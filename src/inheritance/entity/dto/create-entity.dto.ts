import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsDate,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';
import { DayOfWeek } from '../schemas/entity.schema'; // استيراد Enum DayOfWeek
export class CreateCommercialRecordDto {
  @IsString()
  @IsNotEmpty()
  recordNumber: string;

  @IsDate()
  @IsNotEmpty()
  grantDate: Date;

  @IsDate()
  @IsNotEmpty()
  issueDate: Date;

  @IsDate()
  @IsNotEmpty()
  expirationDate: Date;

  @IsString()
  @IsNotEmpty()
  taxNumber: string;
}

export class CreateInsuranceCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  companyPhone: string;

  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;
}

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsString()
  @IsNotEmpty()
  swiftCode: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsOptional()
  bankAddress?: string; // اختياري

  @IsString()
  @IsNotEmpty()
  accountNumber: string;
}

// DTO للـ ContactInfo
export class CreateContactInfoDto {
  @IsString()
  value: string; // القيمة مثل البريد الإلكتروني أو رقم الهاتف أو حساب التواصل الاجتماعي

  @IsEnum(['email', 'phone', 'socialMedia'])
  type: string; // نوع التواصل مثل البريد الإلكتروني أو الهاتف أو حساب التواصل الاجتماعي

  @IsBoolean()
  isPublic: boolean; // إذا كان هذا النوع من الاتصال عام أو خاص

  @IsOptional()
  @IsString()
  subType?: string; // نوع الاتصال مثل العمل أو المكتب أو الشخصي
}

// DTO للـ Holiday
export class CreateHolidayDto {
  @IsString()
  name: string; // اسم العطلة

  @IsDateString()
  date: string; // تاريخ العطلة

  @IsString()
  reason: string; // سبب العطلة
}

// DTO للـ Specialization
export class CreateSpecializationDto {
  @IsString()
  name: string; // اسم التخصص

  @IsString()
  description: string; // وصف التخصص
}

// DTO للـ WorkingDays
export class CreateWorkingDaysDto {
  @IsEnum(DayOfWeek)
  name: DayOfWeek; // يوم العمل من أيام الأسبوع

  @IsString()
  startOfWorkingTime: string; // وقت بدء العمل

  @IsString()
  endOfWorkingTime: string; // وقت نهاية العمل
}

// DTO للـ BaseEntity
export class CreateBaseEntityDto {
  @IsString()
  name: string; // اسم الكيان

  @IsOptional()
  @IsString()
  intro?: string; // المقدمة

  @IsOptional()
  @IsDateString()
  yearOfEstablishment?: string; // سنة التأسيس

  @IsOptional()
  @IsString()
  address?: string; // العنوان

  @IsOptional()
  @IsString()
  logo?: string; // الشعار

  @IsOptional()
  @IsString()
  vision?: string; // الرؤية

  @IsOptional()
  @IsString()
  details?: string; // التفاصيل

  @IsArray()
  @IsOptional()
  ContactInfos?: CreateContactInfoDto[]; // قائمة من ContactInfo

  @IsArray()
  @IsOptional()
  holidays?: CreateHolidayDto[]; // قائمة من Holidays

  @IsArray()
  @IsOptional()
  specialization?: CreateSpecializationDto[]; // قائمة من Specializations

  @IsArray()
  @IsOptional()
  workingDays?: CreateWorkingDaysDto[]; // قائمة من WorkingDays

  @IsArray()
  @IsOptional()
  insuranceCompany?: CreateInsuranceCompanyDto[];

  @IsArray()
  @IsOptional()
  bankAccount?: CreateBankAccountDto[];

  @IsOptional()
  commercialRecord?: CreateCommercialRecordDto;

  @IsOptional()
  locationGoogl?: { x: number; y: number }; // الموقع باستخدام إحداثيات
}
