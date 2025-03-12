import {
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsEnum,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHours } from '../../../common/utlis/helper';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string; // اسم الموظف

  @IsOptional()
  @IsString()
  phone?: string; // رقم هاتف الموظف (اختياري)

  @IsOptional()
  @IsString()
  jobTitle?: string; // المسمى الوظيفي

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHours)
  workingHours?: WorkingHours[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Languages?: string[];

  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsOptional()
  @IsString()
  Professional_experience: string;

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
}
