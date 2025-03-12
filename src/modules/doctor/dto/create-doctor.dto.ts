import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDate,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHours } from '../../../common/utlis/helper';

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  name: string; // اسم الطبيب

  @IsOptional()
  @IsString()
  phone?: string; // رقم هاتف الطبيب (اختياري)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[]; // قائمة التخصصات الطبية

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHours)
  workingHours?: WorkingHours[];

  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty()
  @IsDate()
  birthdate: Date;

  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

  @IsNotEmpty()
  @IsEnum(['Single', 'Married', 'Divorced'])
  marital_status: string;

  @IsNotEmpty()
  number_children: number;

  @IsOptional()
  height: number;
  @IsOptional()
  weight: number;
  @IsOptional()
  Evaluation: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Languages?: string[];

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  blood_type?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
