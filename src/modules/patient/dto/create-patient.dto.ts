import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContactInfoDTO, InsuranceDTO, MedicalTestResultDTO, StatusEntryDTO } from 'src/common/utlis/helper.dto';

export class CreatePatientDto {
  @ApiProperty({ description: 'Patient name', example: 'Jane Doe', required: true })
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

    @ApiProperty({ description: 'Date of Birth', example: '1990-05-20', required: true })
    @IsDate()
    @IsNotEmpty()
    dateOfBirth: Date;

    @ApiProperty({ description: 'Gender', enum: ['male', 'female'], example: 'female', required: true })
    @IsEnum(['male', 'female'])
    @IsNotEmpty()
    gender: string;

    @ApiProperty({ description: 'National ID or Passport', example: '9876543210', required: true })
    @IsString()
    @IsNotEmpty()
    identity: string;

    @ApiProperty({ description: 'Nationality', example: 'Saudi', required: true })
    @IsString()
    @IsNotEmpty()
    nationality: string;

    // @ApiProperty({
    //     description: 'Profile image URL',
    //     example: 'https://hospital.com/patients/janedoe.png',
    //     required: false
    // })
    // @IsOptional()
    // @IsString()
    // image?: string;

    @ApiProperty({
        description: 'Marital Status',
        enum: ['Single', 'Married', 'Divorced', 'Widowed'],
        example: 'Married',
        required: false
    })
    @IsEnum(['Single', 'Married', 'Divorced', 'Widowed'])
    @IsOptional()
    marital_status?: string;

    @ApiProperty({ description: 'Number of Children', example: 3, required: true })
    @IsNumber()
    @IsNotEmpty()
    number_children: number;

    @ApiProperty({
        description: 'Blood Type',
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        example: 'O+',
        required: false
    })
    @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    @IsOptional()
    blood_type?: string;

    @ApiProperty({ description: 'Height in cm', example: 165, required: false })
    @IsNumber()
    @IsOptional()
    height?: number;

    @ApiProperty({ description: 'Weight in kg', example: 60, required: false })
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiProperty({
        description: 'Notes',
        example: 'Patient has a history of asthma.',
        required: false
    })
    @IsOptional()
    @IsString()
    notes?: string;
/*
    @ApiProperty({
        description: 'Email address',
        example: 'jane.doe@example.com',
        required: false
    })
    @IsOptional()
    @IsString()
    email?: string;
*/
    @ApiProperty({
        description: 'patient activation status',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ description: 'Residential address', example: 'Jeddah, Saudi Arabia', required: true })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: 'Emergency Contact',
        type: Object,
        required: false,
        example: { name: 'John Doe', phone: '+966551234567',relationToPatient: "brother"}
    })
    @IsOptional()
    @IsObject()
    emergencyContact?: {
        name: string;
        phone: string;
        relationToPatient: string;
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
        type: [InsuranceDTO],
        description: 'List of insurance details',
        required: false,

    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InsuranceDTO)
    @IsOptional()
    insurances?: InsuranceDTO[];

    @ApiProperty({ type: [MedicalTestResultDTO], description: 'List of medical test results', required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MedicalTestResultDTO)
    @IsOptional()
    medicalTestResults?: MedicalTestResultDTO[];

    @ApiProperty({ description: 'Allergies list',example: 'Peanuts', type: [String], required: false })
    @IsArray()
    @IsOptional()
    allergies?: string[];

    @ApiProperty({ description: 'Preferred Language', example: 'Arabic', required: false })
    @IsString()
    @IsOptional()
    preferredLanguage?: string;

    @ApiProperty({ description: 'Lifestyle factors (Smoking, Alcohol, Exercise)', example: 'Non-smoker, Regular exercise', required: false })
    @IsString()
    @IsOptional()
    lifestyleFactors?: string;

    @ApiProperty({ description: 'Family Medical History',  example: [
        'Diabetes',
        'Hypertension',
        'Heart Disease',
        'Cancer',
      ], type: [String], required: false })
    @IsArray()
    @IsOptional()
    familyMedicalHistory?: string[];
    
    
    @ApiProperty({
      type: [StatusEntryDTO],
      description: 'History of status changes',
      required: true,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StatusEntryDTO)
    statusHistory: StatusEntryDTO[];
      

}
