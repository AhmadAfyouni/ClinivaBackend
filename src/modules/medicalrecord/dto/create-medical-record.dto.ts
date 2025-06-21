import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { MedicationDTO } from 'src/common/utils/helper.dto';

export class CreateMedicalRecordDto {
  @ApiProperty({
    description: 'Patient ID linked to the medical record',
    example: '60f7c7b84f1a2c001c8b4567',
    required: false,
  })
  @IsMongoId()
  @IsNotEmpty()
  patient: Types.ObjectId;

  @ApiProperty({
    description: 'Doctor ID linked to the medical record',
    example: '60f7c7b84f1a2c001c8b4567',
    required: false,
  })
  @IsMongoId()
  @IsNotEmpty()
  doctor: Types.ObjectId;

  @ApiProperty({
    description: 'Appointment ID linked to the medical record',
    example: '60f7c7b84f1a2c001c8b4567',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  appointment: Types.ObjectId;

  @ApiProperty({
    description: 'Patient symptoms',
    example: 'Fever, Cough, Shortness of breath',
    required: false,
  })
  @IsOptional()
  @IsString()
  symptoms?: string; // الأعراض

  @ApiProperty({
    description: 'Treatment plan prescribed by the doctor',
    example: 'Rest, Hydration, Paracetamol 500mg twice a day',
    required: false,
  })
  @IsOptional()
  @IsString()
  treatmentPlan?: string; // خطة العلاج

  @ApiProperty({
    description: 'Medical diagnosis',
    example: 'Acute bronchitis',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiProperty({
    type: [MedicationDTO],
    description: 'قائمة الأدوية الموصوفة',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDTO)
  @IsOptional() // يجعل الخاصية اختيارية
  medications: MedicationDTO[];

  @ApiProperty({
    type: [String],
    description: 'List of required lab tests',
    example: ['Blood Test', 'X-Ray'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  labTests?: string[];

  // @ApiProperty({
  //     description: 'Record status',
  //     enum: ['draft', 'finalized'],
  //     example: 'draft',
  //     required: false
  // })
  // @IsEnum(['draft', 'finalized'])
  // @IsOptional()
  // recordStatus?: string;

  // @ApiProperty({
  //      description: 'Patient rating for the doctor (1-5)',
  //      example: 4,
  //      required: false
  //  })
  //  @IsOptional()
  //  @IsNumber()
  //  @Min(1)
  //  @Max(5)
  //  patientRating?: number;

  // @ApiProperty({
  //     description: 'Patient feedback on the service',
  //     example: 'The doctor was very professional and helpful.',
  //     required: false
  // })
  // @IsOptional()
  // @IsString()
  // patientFeedback?: string;

  @ApiProperty({
    description: 'Severity level of the condition',
    enum: ['mild', 'moderate', 'severe'],
    example: 'moderate',
    required: true,
  })
  @IsEnum(['mild', 'moderate', 'severe'])
  @IsNotEmpty()
  severityLevel: string;

  @ApiProperty({
    description: 'Start time of the appointment',
    example: '2025-03-24T08:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  startTime?: Date;

  @ApiProperty({
    description: 'End time of the appointment',
    example: '2025-03-24T09:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  endTime?: Date;

  @ApiProperty({
    description: 'Next appointment date',
    example: '2025-04-01T08:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  nextAppointmentDate?: Date;

  @ApiProperty({
    description: 'Type of visit',
    enum: [
      'routine check-up',
      'follow-up',
      'emergency',
      'consultation',
      'treatment',
    ],
    example: 'follow-up',
    required: true,
  })
  @IsEnum([
    'routine check-up',
    'follow-up',
    'emergency',
    'consultation',
    'treatment',
  ])
  @IsNotEmpty()
  visitType: string;
}
