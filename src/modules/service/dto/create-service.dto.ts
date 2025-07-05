import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEnum,
  ValidateNested,
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

  @ApiPropertyOptional({
    description: 'Number of sessions',
    example: 1,
    default: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sessionsNumber?: number = 1;

  @ApiPropertyOptional({
    description: 'List of session details',
    type: [ServiceSession],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceSession)
  @IsOptional()
  session?: ServiceSession[] = [];

  @ApiPropertyOptional({
    description: 'List of Doctor IDs',
    example: ['609e125f531123456789dcba', '609e125f531123456789dcbb'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  doctor?: string[] = [];

  @ApiPropertyOptional({
    description: 'List of clinic IDs',
    example: ['609e125f531123456789dcba', '609e125f531123456789dcbb'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  clinics?: string[] = [];

  @ApiPropertyOptional({
    description: 'Complex ID',
    example: '609e125f531123456789dcbb',
  })
  @IsMongoId()
  @IsOptional()
  complex?: string;

  @ApiPropertyOptional({
    description: 'Service active status',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @ApiProperty({
    description: 'Public ID for the service',
    example: 'SRV-12345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiPropertyOptional({
    description: 'Whether the service is deleted',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  deleted: boolean = false;
}
