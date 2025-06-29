import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceSession } from 'src/common/utils/helper.dto';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Service name',
    example: 'General Consultation',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Service category',
    example: 'Consultation',
    required: true,
    enum: [
      'Consultation',
      'Medical Examination',
      'Medical Procedure',
      'Therapy Session',
      'Dental Session',
      'Laboratory Test',
      'Radiology',
      'Vaccination',
      'Cosmetic Procedure',
      'Wellness or Counseling',
      'Reevaluation',
      'Emergency Procedure',
    ],
  })
  @IsEnum([
    'Consultation',
    'Medical Examination',
    'Medical Procedure',
    'Therapy Session',
    'Dental Session',
    'Laboratory Test',
    'Radiology',
    'Vaccination',
    'Cosmetic Procedure',
    'Wellness or Counseling',
    'Reevaluation',
    'Emergency Procedure',
  ])
  category: string;

  @ApiProperty({
    description: 'Number of sessions',
    example: 5,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  sessionsNumber: number;

  @ApiProperty({
    description: 'List of session details',
    required: false,
  })
  session?: ServiceSession[];

  @ApiProperty({
    description: 'List of Doctor IDs',
    example: ['609e125f531123456789dcba', '609e125f531123456789dcbb'],
    required: false,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  doctor?: string[];

  @ApiProperty({
    description: 'List of clinic IDs',
    example: ['609e125f531123456789dcba', '609e125f531123456789dcbb'],
    required: false,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  clinics?: string[];

  @ApiProperty({
    description: 'Complex ID',
    example: '609e125f531123456789dcbb',
    required: false,
  })
  @IsMongoId()
  complex?: string;

  @ApiProperty({
    description: 'Is the service active?',
    example: true,
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Public ID of the service',
    example: 'service-12345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiProperty({
    description: 'Is the service deleted?',
    example: false,
    required: false,
  })
  deleted?: boolean;
}
