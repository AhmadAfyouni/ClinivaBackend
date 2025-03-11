import { IsNotEmpty, IsOptional, IsString, IsDate, IsEnum, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

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
    @IsDate()
    dateOfBirth: Date;

    @IsNotEmpty()
    @IsEnum(['male', 'female'])
    gender: string;

    @IsOptional()
    @IsString()
    email?: string;

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
}
