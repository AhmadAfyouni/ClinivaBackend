import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    example: 'Cardiology Department',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Department description',
    example:
      'This department focuses on cardiology and heart-related treatments.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Department activation status',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Clinic Collection ID to which the department belongs',
    example: '60f7c7b84f1a2c001c8b4567',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  clinicCollectionId: Types.ObjectId;
}
