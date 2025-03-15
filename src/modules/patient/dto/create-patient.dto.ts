import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {ContactInfo, Insurance} from '../../../common/utlis/helper';

export class CreatePatientDto {
    @ApiProperty({description: 'Patient name', example: 'Jane Doe'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({type: [ContactInfo], description: 'List of contact information'})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ContactInfo)
    @IsOptional()
    ContactInfos?: ContactInfo[];

    @ApiProperty({description: 'Date of Birth', example: '1990-05-20'})
    @IsDate()
    @IsNotEmpty()
    dateOfBirth: Date;

    @ApiProperty({description: 'Gender', enum: ['male', 'female']})
    @IsEnum(['male', 'female'])
    @IsNotEmpty()
    gender: string;

    @ApiProperty({description: 'National ID or Passport', example: '9876543210'})
    @IsString()
    @IsNotEmpty()
    identity: string;

    @ApiProperty({description: 'Nationality', example: 'Saudi'})
    @IsString()
    @IsNotEmpty()
    nationality: string;

    @ApiPropertyOptional({description: 'Profile image URL'})
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({description: 'Marital Status', enum: ['Single', 'Married', 'Divorced', 'Widowed'], default: 'Single'})
    @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
    @IsOptional()
    marital_status?: string;

    @ApiProperty({description: 'Number of Children', example: 3})
    @IsNumber()
    @IsNotEmpty()
    number_children: number;

    @ApiPropertyOptional({description: 'Blood Type', enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']})
    @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    @IsOptional()
    blood_type?: string;

    @ApiPropertyOptional({description: 'Height in cm', example: 165})
    @IsNumber()
    @IsOptional()
    height?: number;

    @ApiPropertyOptional({description: 'Weight in kg', example: 60})
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiPropertyOptional({description: 'Notes'})
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({description: 'Email address', example: 'jane.doe@example.com'})
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({description: 'Residential address', example: 'Jeddah, Saudi Arabia'})
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiPropertyOptional({description: 'Emergency Contact', type: Object})
    @IsOptional()
    @IsObject()
    emergencyContact?: {
        name: string;
        phone: string;
    };

    @ApiPropertyOptional({type: [String], description: 'List of chronic diseases'})
    @IsArray()
    @IsOptional()
    ChronicDiseases?: { disease_name: string }[];

    @ApiPropertyOptional({type: [Insurance], description: 'List of insurance details'})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Insurance)
    @IsOptional()
    insurances?: Insurance[];
}
