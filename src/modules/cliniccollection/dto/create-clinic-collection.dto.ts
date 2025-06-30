import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { GeneralInfo } from 'src/common/utils/helper.dto';

class DepartmentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
export class CreateClinicCollectionDto {
  @ApiProperty({
    description: 'list of Department name for the complex',
    type: [DepartmentDto],
    required: true,
  })
  @Type(() => DepartmentDto)
  departments: DepartmentDto[];
  @ApiProperty({
    description: 'Indicates if the complex is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Trade name of the complex',
    example: 'Saudi Clinics Group',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tradeName: string;

  @ApiProperty({
    description: 'Legal name of the complex',
    example: 'Saudi Clinics Group LLC',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  legalName: string;

  @ApiPropertyOptional({
    description: 'Logo of the complex',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    description: 'General information about the complex',
    type: GeneralInfo,
    required: true,
  })
  @Type(() => GeneralInfo)
  generalInfo: GeneralInfo;

  @ApiProperty({
    description: 'Maximum number of patients the complex can handle',
    example: 1000,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  patientCapacity: number;

  @ApiProperty({
    description: 'General policies of the complex',
    example: 'The clinic follows strict hygiene standards.',
    required: false,
  })
  @IsString()
  @IsOptional()
  policies?: string;

  @ApiProperty({
    description: 'Reference to the company this complex belongs to',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  companyId?: Types.ObjectId;

  @ApiProperty({
    description: 'Reference to the Person in Charge (PIC) of the complex',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  PIC: Types.ObjectId;

  @ApiProperty({
    description: 'Public unique identifier for the complex',
    example: 'clinic-col-12345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;
}
