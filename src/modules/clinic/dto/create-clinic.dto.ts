import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { WorkingHours } from 'src/common/utils/helper';
import { GeneralInfo } from 'src/common/utils';

export class CreateClinicDto {
  @ApiProperty({ description: 'Clinic name', example: 'Al Noor Clinic' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Add the expected time for each visit in minutes.',
    example: 30,
  })
  @IsNotEmpty()
  @IsNumber()
  AverageDurationOfVisit: number;

  @ApiProperty({
    description: 'Clinic activation status',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: 'Clinic logo URL',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    description: 'General information about the clinic',
    type: GeneralInfo,
  })
  @ValidateNested()
  @Type(() => GeneralInfo)
  generalInfo: GeneralInfo;

  @ApiProperty({
    description: 'List of service IDs associated with the clinic',
    example: ['60f7c7b84f1a2c001c8b4567', '60f7c7b84f1a2c001c8b4568'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  services: Types.ObjectId[];

  @ApiPropertyOptional({
    type: [WorkingHours],
    description: 'Working hours of the clinic',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHours)
  @IsOptional()
  WorkingHours?: WorkingHours[];

  @ApiPropertyOptional({
    description: 'Department ID that the clinic belongs to',
    example: '60f7c7b84f1a2c001c8b4567',
  })
  @IsOptional()
  @IsMongoId()
  departmentId?: Types.ObjectId;

  @ApiProperty({
    description: 'Public ID for the clinic',
    example: 'clinic-123',
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiPropertyOptional({
    description: 'Description of the clinic',
  })
  @IsString()
  @IsOptional()
  Description?: string;

  @ApiProperty({
    description: 'Maximum number of patients the clinic can handle',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  PatientCapacity: number;

  @ApiProperty({
    description: 'Maximum number of doctors the clinic can accommodate',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  DoctorsCapacity: number;

  @ApiProperty({
    description: 'Maximum number of staff members the clinic can accommodate',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  StaffMembersCapacity: number;
}
