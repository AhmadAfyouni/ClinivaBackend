import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Certificate } from 'crypto';
import { BreakTimeDTO, ContactInfoDTO, VacationDTO, WorkingHoursDTO } from 'src/common/utlis/helper.dto';



export class CreateEmployeeDto {
    @ApiProperty({ description: 'Employee name', example: 'John Doe', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

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
        description: 'Notes',
        example: 'Expert in cardiology and patient care.',
        required: false
    })
    @IsOptional()
    @IsString()
    notes?: string;

    // @ApiProperty({
    //     description: 'Email address',
    //     example: 'john.doe@example.com',
    //     required: false
    // })
    // @IsOptional()
    // @IsString()
    // email?: string;

    @ApiProperty({ description: 'Residential address', example: 'Riyadh, Saudi Arabia', required: true })
    @IsString()
    @IsNotEmpty()
    address: string;



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
        type: [WorkingHoursDTO],
        description: 'Working hours',
        required: true,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingHoursDTO)
    workingHours: WorkingHoursDTO[];



    @ApiProperty({ 
        type: [VacationDTO], 
        description: 'List of leaves', 
        required: true,
      })
      @IsArray()
      @ValidateNested({ each: true })
      @Type(() => VacationDTO)
      vacationRecords: VacationDTO[];

    // @ApiProperty({
    //     description: 'Evaluation score (1-10)',
    //     example: 8,
    //     required: false
    // })
    // @IsNumber()
    // @IsOptional()
    // evaluation?: number;

    @ApiProperty({
        description: 'Employee Type',
        enum: ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Employee', 'Other'],
        example: 'Doctor',
        required: true
    })
    @IsEnum(['Doctor', 'Nurse', 'Technician', 'Administrative', 'Employee', 'Other'])
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
    certifications?: Certificate[];

    @ApiProperty({ description: 'Job Type', enum: ['FULL_TIME', 'PART_TIME'], required: true })
    @IsEnum(['FULL_TIME', 'PART_TIME'])
    @IsNotEmpty()
    jobType: string;

    @ApiProperty({ type: [BreakTimeDTO], description: 'Break Times', required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BreakTimeDTO)
    @IsOptional()
    breakTimes?: BreakTimeDTO[];

    @ApiProperty({
        description: 'Employee activation status',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    
      @ApiProperty({
        description: 'Company ID where the user works',
        example: '60f7c7b84f1a2c001c8b4568',
        required: false,
      })
      @IsMongoId()
      @IsOptional()
      companyId?: Types.ObjectId;
    
      @ApiProperty({
        description: 'Clinic Collection ID where the user works',
        example: '60f7c7b84f1a2c001c8b4569',
        required: false,
      })
      @IsMongoId()
      @IsOptional()
      clinicCollectionId?: Types.ObjectId;
    
      @ApiProperty({
        description: 'Department ID where the user works',
        example: '60f7c7b84f1a2c001c8b4570',
        required: false,
      })
      @IsMongoId()
      @IsOptional()
      departmentId?: Types.ObjectId;
    
      @ApiProperty({
        type: [String],
        description: 'List of clinic IDs where the user works',
        example: ['60f7c7b84f1a2c001c8b4571'],
        required: false,
      })
      @IsArray()
      @IsMongoId({ each: true })
      @IsOptional()
      clinics?: Types.ObjectId[];
    
      @ApiProperty({
        description: 'List of specialization IDs associated with the clinic',
        example: ['60f7c7b84f1a2c001c8b4567', '60f7c7b84f1a2c001c8b4568'],
        required: true,
      })
      @IsArray()
      @IsMongoId({ each: true })
      @IsNotEmpty()
      specializations: Types.ObjectId[];      
}
