import { ApiProperty } from '@nestjs/swagger';
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
import { Type } from 'class-transformer';
import { ContactInfo, WorkingHours } from '../../../common/utlis/helper';

export class CreateEmployeeDto {
    @ApiProperty({ description: 'Employee name', example: 'John Doe', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: [ContactInfo],
        description: 'List of contact information',
        required: false,
        example: [
            { type: 'phone', value: '+966501234567', isPublic: true, subType: 'work' },
            { type: 'email', value: 'johndoe@hospital.com', isPublic: true, subType: 'corporate' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactInfo)
    @IsOptional()
    ContactInfos?: ContactInfo[];

    @ApiProperty({ description: 'Date of Birth', example: '1985-06-15', required: true })
    @IsDate()
    @IsNotEmpty()
    dateOfBirth: Date;

    @ApiProperty({ description: 'Gender', enum: ['male', 'female'], example: 'male', required: true })
    @IsEnum(['male', 'female'])
    @IsNotEmpty()
    gender: string;

    @ApiProperty({ description: 'National ID or Passport', example: '1234567890', required: true })
    @IsString()
    @IsNotEmpty()
    identity: string;

    @ApiProperty({ description: 'Nationality', example: 'Saudi', required: true })
    @IsString()
    @IsNotEmpty()
    nationality: string;

    @ApiProperty({
        description: 'Profile image URL',
        example: 'https://hospital.com/employees/johndoe.png',
        required: false
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({
        description: 'Marital Status',
        enum: ['Single', 'Married', 'Divorced', 'Widowed'],
        example: 'Married',
        required: false
    })
    @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
    @IsOptional()
    marital_status?: string;

    @ApiProperty({
        description: 'Number of Children',
        example: 2,
        required: false
    })
    @IsNumber()
    @IsOptional()
    number_children?: number;

    @ApiProperty({
        description: 'Blood Type',
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        example: 'O+',
        required: false
    })
    @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    @IsOptional()
    blood_type?: string;

    @ApiProperty({
        description: 'Height in cm',
        example: 180,
        required: false
    })
    @IsNumber()
    @IsOptional()
    height?: number;

    @ApiProperty({
        description: 'Weight in kg',
        example: 75,
        required: false
    })
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiProperty({
        description: 'Notes',
        example: 'Expert in cardiology and patient care.',
        required: false
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({
        description: 'Email address',
        example: 'john.doe@example.com',
        required: false
    })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ description: 'Residential address', example: 'Riyadh, Saudi Arabia', required: true })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: 'Emergency Contact',
        type: Object,
        required: false,
        example: { name: 'Jane Doe', phone: '+966551234567' }
    })
    @IsOptional()
    @IsObject()
    emergencyContact?: {
        name: string;
        phone: string;
    };

    @ApiProperty({
        type: [Object],
        description: 'List of chronic diseases',
        required: false,
        example: [
            { disease_name: 'Hypertension' },
            { disease_name: 'Diabetes' }
        ]
    })
    @IsArray()
    @IsOptional()
    ChronicDiseases?: { disease_name: string }[];

    @ApiProperty({
        description: 'Professional experience details',
        example: '10 years of experience in emergency medicine.',
        required: false
    })
    @IsOptional()
    @IsString()
    professional_experience?: string;

    @ApiProperty({
        type: [String],
        description: 'Specialties',
        required: false,
        example: ['Cardiology', 'Emergency Medicine']
    })
    @IsArray()
    @IsOptional()
    specialties?: string[];

    @ApiProperty({
        type: [String],
        description: 'Languages spoken',
        required: false,
        example: ['English', 'Arabic']
    })
    @IsArray()
    @IsOptional()
    Languages?: string[];

    @ApiProperty({
        type: [WorkingHours],
        description: 'Working hours',
        required: true,
        example: [
            { day: 'Monday', timeSlots: [{ startTime: '08:00 AM', endTime: '04:00 PM' }] },
            { day: 'Wednesday', timeSlots: [{ startTime: '08:00 AM', endTime: '04:00 PM' }] }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingHours)
    workingHours: WorkingHours[];

    @ApiProperty({
        description: 'Evaluation score (1-10)',
        example: 8,
        required: false
    })
    @IsNumber()
    @IsOptional()
    evaluation?: number;

    @ApiProperty({
        description: 'Employee Type',
        enum: ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Employee', 'Other'],
        example: 'Doctor',
        required: true
    })
    @IsEnum(['Doctor', 'Nurse', 'Technician', 'Administrative', 'Employee', 'Other'])
    @IsNotEmpty()
    employeeType: string;
}
