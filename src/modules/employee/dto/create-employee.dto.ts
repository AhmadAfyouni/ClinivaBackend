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
import {ContactInfo, WorkingHours} from '../../../common/utlis/helper';

export class CreateEmployeeDto {
    @ApiProperty({description: 'Employee name', example: 'John Doe'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        type: [ContactInfo],
        description: 'List of contact information',
        example: [
            {type: 'phone', value: '+966501234567', isPublic: true, subType: 'work'},
            {type: 'email', value: 'johndoe@hospital.com', isPublic: true, subType: 'corporate'}
        ]
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ContactInfo)
    @IsOptional()
    ContactInfos?: ContactInfo[];

    @ApiProperty({description: 'Date of Birth', example: '1985-06-15'})
    @IsDate()
    @IsNotEmpty()
    dateOfBirth: Date;

    @ApiProperty({description: 'Gender', enum: ['male', 'female'], example: 'male'})
    @IsEnum(['male', 'female'])
    @IsNotEmpty()
    gender: string;

    @ApiProperty({description: 'National ID or Passport', example: '1234567890'})
    @IsString()
    @IsNotEmpty()
    identity: string;

    @ApiProperty({description: 'Nationality', example: 'Saudi'})
    @IsString()
    @IsNotEmpty()
    nationality: string;

    @ApiPropertyOptional({description: 'Profile image URL', example: 'https://hospital.com/employees/johndoe.png'})
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({
        description: 'Marital Status',
        enum: ['Single', 'Married', 'Divorced', 'Widowed'],
        example: 'Married'
    })
    @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
    @IsOptional()
    marital_status?: string;

    @ApiPropertyOptional({description: 'Number of Children', example: 2})
    @IsNumber()
    @IsOptional()
    number_children?: number;

    @ApiPropertyOptional({
        description: 'Blood Type',
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        example: 'O+'
    })
    @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    @IsOptional()
    blood_type?: string;

    @ApiPropertyOptional({description: 'Height in cm', example: 180})
    @IsNumber()
    @IsOptional()
    height?: number;

    @ApiPropertyOptional({description: 'Weight in kg', example: 75})
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiPropertyOptional({description: 'Notes', example: 'Expert in cardiology and patient care.'})
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({description: 'Email address', example: 'john.doe@example.com'})
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({description: 'Residential address', example: 'Riyadh, Saudi Arabia'})
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiPropertyOptional({
        description: 'Emergency Contact',
        type: Object,
        example: {name: 'Jane Doe', phone: '+966551234567'}
    })
    @IsOptional()
    @IsObject()
    emergencyContact?: {
        name: string;
        phone: string;
    };

    @ApiPropertyOptional({
        type: [Object],
        description: 'List of chronic diseases',
        example: [
            {disease_name: 'Hypertension'},
            {disease_name: 'Diabetes'}
        ]
    })
    @IsArray()
    @IsOptional()
    ChronicDiseases?: { disease_name: string }[];

    @ApiPropertyOptional({
        description: 'Professional experience details',
        example: '10 years of experience in emergency medicine.'
    })
    @IsOptional()
    @IsString()
    professional_experience?: string;

    @ApiPropertyOptional({
        type: [String],
        description: 'Specialties',
        example: ['Cardiology', 'Emergency Medicine']
    })
    @IsArray()
    @IsOptional()
    specialties?: string[];

    @ApiPropertyOptional({
        type: [String],
        description: 'Languages spoken',
        example: ['English', 'Arabic']
    })
    @IsArray()
    @IsOptional()
    Languages?: string[];

    @ApiPropertyOptional({
        type: [WorkingHours],
        description: 'Working hours',
        example: [
            {day: 'Monday', timeSlots: [{startTime: '08:00 AM', endTime: '04:00 PM'}]},
            {day: 'Wednesday', timeSlots: [{startTime: '08:00 AM', endTime: '04:00 PM'}]}
        ]
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => WorkingHours)
    @IsOptional()
    workingHours?: WorkingHours[];

    @ApiPropertyOptional({description: 'Evaluation score (1-10)', example: 8})
    @IsNumber()
    @IsOptional()
    evaluation?: number;

    @ApiProperty({
        description: 'Employee Type',
        enum: ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Employee', 'Other'],
        example: 'Doctor'
    })
    @IsEnum(['Doctor', 'Nurse', 'Technician', 'Administrative', 'Employee', 'Other'])
    @IsNotEmpty()
    employeeType: string;
}
