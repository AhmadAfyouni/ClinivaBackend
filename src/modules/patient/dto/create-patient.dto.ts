import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
class EmergencyContactDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
class InsuranceDto {
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
export class DiseaseDto {
  @IsString()
  disease_name: string;
}

export class CreatePatientDto {
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
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
  marital_status?: string;

  @IsNotEmpty()
  @IsNumber()
  number_children: number;

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

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
  @IsArray()
  @IsOptional()
  @Type(() => DiseaseDto)
  ChronicDiseases?: DiseaseDto[];
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsuranceDto)
  insurances?: InsuranceDto[];
}
