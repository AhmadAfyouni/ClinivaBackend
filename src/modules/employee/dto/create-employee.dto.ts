import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import {
  ContactInfoDTO,
  VacationDTO,
  WorkingHoursBase,
} from 'src/common/utils/helper.dto';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Employee name',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'password', required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User ID',
    example: '60f7c7b84f1a2c001c8b4568',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @ApiProperty({
    type: [ContactInfoDTO],
    description: 'List of contact information',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInfoDTO)
  @IsOptional()
  contactInfos?: ContactInfoDTO[];

  @ApiProperty({
    description: 'Date of Birth',
    example: '1985-06-15',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Gender',
    enum: ['male', 'female'],
    example: 'male',
    required: true,
  })
  @IsEnum(['male', 'female'])
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: 'National ID or Passport',
    example: '1234567890',
    required: true,
  })
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
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Marital Status',
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    example: 'Married',
    required: false,
  })
  @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
  @IsOptional()
  marital_status?: string;

  @ApiProperty({
    description: 'Number of Children',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  number_children?: number;

  @ApiProperty({
    description: 'Notes',
    example: 'Expert in cardiology and patient care.',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Residential address',
    example: 'Riyadh, Saudi Arabia',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Professional experience details',
    example: '10 years of experience in emergency medicine.',
    required: false,
  })
  @IsOptional()
  @IsString()
  professional_experience?: string;

  @ApiProperty({
    type: [String],
    description: 'Specialties',
    required: false,
    example: ['Cardiology', 'Emergency Medicine'],
  })
  @IsArray()
  @IsOptional()
  specialties?: string[];

  @ApiProperty({
    type: [String],
    description: 'Languages spoken',
    required: false,
    example: ['English', 'Arabic'],
  })
  @IsArray()
  @IsOptional()
  Languages?: string[];

  @ApiProperty({
    type: [WorkingHoursBase],
    description: 'Employee working hours',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursBase)
  workingHours?: WorkingHoursBase[];

  @ApiProperty({
    type: [VacationDTO],
    description: 'List of leaves',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VacationDTO)
  vacationRecords: VacationDTO[];

  @ApiProperty({
    description: 'Employee Type',
    enum: [
      'Doctor',
      'Nurse',
      'Technician',
      'Administrative',
      'Employee',
      'Other',
    ],
    example: 'Doctor',
    required: true,
  })
  @IsEnum([
    'Doctor',
    'Nurse',
    'Technician',
    'Administrative',
    'Employee',
    'Other',
  ])
  @IsNotEmpty()
  employeeType: string;

  @ApiProperty({ description: 'Hire Date', required: true })
  @IsDate()
  @IsNotEmpty()
  hireDate: Date;

  @ApiProperty({ description: 'Medical License Number', required: false })
  @IsOptional()
  @IsString()
  medicalLicenseNumber?: string;

  @ApiProperty({ description: 'Certifications', required: false })
  @IsArray()
  @IsOptional()
  certifications?: string[];

  @ApiProperty({
    description: 'Job Title',
    required: true,
  })
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({
    description: 'Employee activation status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'List of specialization IDs associated with the clinic',
    example: ['60f7c7b84f1a2c001c8b4567', '60f7c7b84f1a2c001c8b4568'],
    required: true,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  specializations: Types.ObjectId[];

  @ApiProperty({
    description: 'Clinic ID where the user works',
    example: '60f7c7b84f1a2c001c8b4568',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  clinicId?: Types.ObjectId;

  @ApiProperty({
    description: 'List of clinic IDs where the user works',
    example: ['60f7c7b84f1a2c001c8b4567', '60f7c7b84f1a2c001c8b4568'],
    required: false,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  clinicIds?: Types.ObjectId[];

  @ApiProperty({
    description: 'Complex ID where the user works',
    example: '60f7c7b84f1a2c001c8b4569',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  complexId?: Types.ObjectId;

  @ApiProperty({ description: 'Owner', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  Owner?: boolean;
}
