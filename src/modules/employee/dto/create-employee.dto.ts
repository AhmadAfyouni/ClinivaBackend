import {
  IsNotEmpty,IsObject,
  IsOptional,
  IsString,
  IsArray,Min,Max,
  ValidateNested,IsEmail,IsMongoId,
  IsPhoneNumber,IsEnum,IsDate,IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHours } from '../../../common/utlis/helper';

export class EmergencyContactDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;
}

export class DiseaseDto {
  @IsString()
  disease_name: string;
}
export class InsuranceDto {
  @IsNotEmpty()
  @IsString()
  insuranceProvider: string;

  @IsNotEmpty()
  @IsString()
  insuranceNumber: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  coveragePercentage: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expiryDate: Date;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['private', 'governmental', 'corporate'])
  insuranceType: string;
}

export class TimeSlotDto {
  @IsNotEmpty()
  @IsString()
  startTime: string; // وقت بدء العمل (مثال: "04:00 PM")

  @IsNotEmpty()
  @IsString()
  endTime: string; // وقت انتهاء العمل (مثال: "08:00 PM")
}
 
  
 
export class WorkingHoursDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum([
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ])
  day: string; // اليوم

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots: TimeSlotDto[]; // قائمة الفترات الزمنية لكل يوم
}

export class CreateEmployeeDto {

  
    @IsString()
    name: string;
  
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
  
    @IsDate()
    @Type(() => Date)
    dateOfBirth: Date;
  
    @IsEnum(['male', 'female'])
    gender: string;
  
    @IsOptional()
    @IsString()
    identity?: string; // National ID or Passport
  
    @IsString()
    nationality: string;
  
    @IsOptional()
    @IsString()
    image?: string;
  
    @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
    @IsOptional()
    marital_status?: string; // القيمة الافتراضية Single
  
    @IsNumber()
    number_children: number;
  
    @IsOptional()
    @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    blood_type?: string;
  
    @IsOptional()
    @IsNumber()
    height?: number; // in cm
  
    @IsOptional()
    @IsNumber()
    weight?: number; // in kg
  
    @IsOptional()
    @IsString()
    notes?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @IsString()
    address: string;
  
    @IsOptional()
    @IsObject()
    @Type(() => EmergencyContactDto)
    emergencyContact?: EmergencyContactDto;  // يحتوي على الاسم ورقم الهاتف
  
    @IsArray()
    @IsOptional()
    @Type(() => DiseaseDto)
    ChronicDiseases?: DiseaseDto[];
  
    @IsArray()
    @IsOptional()
    @Type(() => InsuranceDto)
    insurances?: InsuranceDto[];
  
    @IsOptional()
    @IsString()
    professiona_experience?: string;
  
    @IsArray()
    @IsOptional()
    specialties: string[];
  
    @IsArray()
    @IsOptional()
    Languages?: string[];
  
    @IsArray()
    @IsOptional()
    @Type(() => WorkingHoursDto)
    workingHours?: WorkingHoursDto[];
  
    @IsOptional()
    @IsNumber()
    evaluation?: number; // مثال: 1-10 rating system
    @IsOptional()
    @IsMongoId()
    companyId?: string; // Employee can belong to a company
  
    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    clinicCollectionId?: string[]; // Employee can belong to multiple clinic collection
  
    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    departmentId?: string[]; // Employee can belong to multiple department
  
    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    clinics?: string[]; // Employee can work in multiple clinics
}
