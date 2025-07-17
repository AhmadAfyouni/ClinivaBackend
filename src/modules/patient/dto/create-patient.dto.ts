import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EmergencyContactDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  relationship?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class PersonalDocumentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  issueDate?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  issuingAuthority?: string;
}

export class CreatePatientDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  cardNumber: string;

  @ApiProperty({ required: false })
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty({ required: false, enum: ['male', 'female'] })
  @IsEnum(['male', 'female'])
  @IsOptional()
  gender?: string;

  @ApiProperty({
    required: false,
    enum: ['Arabic', 'English', 'French', 'German'],
  })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({
    required: false,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
  })
  @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
  @IsOptional()
  maritalStatus?: string;

  @ApiProperty({
    required: false,
    enum: ['Arabic', 'English', 'French', 'German'],
    default: 'Arabic',
  })
  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  @ApiProperty({
    required: false,
    enum: ['Muslim', 'Christian', 'Druze', 'Other'],
  })
  @IsEnum(['Muslim', 'Christian', 'Druze', 'Other'])
  @IsOptional()
  religion?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ type: [PersonalDocumentDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonalDocumentDto)
  @IsOptional()
  personalDocuments?: PersonalDocumentDto[];

  @ApiProperty({ required: true })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  buildingNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  streetName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nation?: string;

  // Insurance Information
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  memberNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  memberType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  insuranceCompany?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  providerNetwork?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  policyID?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  class?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coPayment?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coverageLimit?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coverageStartDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coverageEndDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  insuranceStatus?: string;

  @ApiProperty({ type: EmergencyContactDto, required: false })
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  @IsOptional()
  emergencyContact?: EmergencyContactDto;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
