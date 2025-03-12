import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDate,
    IsEnum,
    IsArray,
    ValidateNested,
    Min,
    Max,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { Types } from 'mongoose';
  
  class EmergencyContact {
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
    @Min(0)
    @Max(100)
    coveragePercentage: number;
  
    @IsNotEmpty()
    @IsDate()
    expiryDate: Date;
  
    @IsNotEmpty()
    @IsEnum(['private', 'governmental', 'corporate'])
    insuranceType: string;
  }
  
  export class CreatePatientDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsString()
    phone: string;
  
    @IsNotEmpty()
    @IsString()
    identity: string;
  
    @IsNotEmpty()
    @IsDate()
    dateOfBirth: Date;
  
    @IsNotEmpty()
    @IsEnum(['male', 'female'])
    gender: string;
  
    @IsNotEmpty()
    @IsEnum(['Single', 'Married', 'Divorced'])
    marital_status: string;
  
    @IsNotEmpty()
    number_children: number;
  
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
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InsuranceDto)
    insurances?: InsuranceDto[];
    
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EmergencyContact)
    emergencyContact?: EmergencyContact[];
  }
  