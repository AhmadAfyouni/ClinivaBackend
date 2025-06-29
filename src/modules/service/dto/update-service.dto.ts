import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsMongoId,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceSession } from 'src/common/utils/helper.dto';

export class UpdateServiceDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
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
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sessionsNumber?: number;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  session?: ServiceSession[];

  @ApiProperty({ required: false })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @IsOptional()
  doctor?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  @IsOptional()
  clinics?: string[];

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  complex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  publicId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  deleted?: boolean;
}
