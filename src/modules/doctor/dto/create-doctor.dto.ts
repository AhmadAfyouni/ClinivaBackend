import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  IsObject,
  IsOptional,
  Min,
  Max,
  IsDate,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

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
export class DiseaseDto {
    @IsString()
    disease_name: string;
  }
export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsOptional()
  @IsString()
  identity?: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
  marital_status?: string;

  @IsOptional()
  @IsNumber()
  number_children?: number;

  @IsOptional()
  @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
  blood_type?: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => InsuranceDto)
  emergencyContact?: {
    name: string;
    phone: string;
  };

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsuranceDto)
  insurances?: InsuranceDto[];

  @IsOptional()
  @IsString()
  professiona_experience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Languages?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto[];

  @IsOptional()
  @IsNumber()
  evaluation?: number;

  // @IsNotEmpty()
  // @IsObject()
  // departmentId: Types.ObjectId;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  clinics?: Types.ObjectId[];

      @IsArray()
      @IsOptional()
      @Type(() => DiseaseDto)
      ChronicDiseases?: DiseaseDto[];
}
