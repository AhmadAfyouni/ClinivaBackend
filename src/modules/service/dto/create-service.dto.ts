import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

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
    description: 'Service description',
    example: 'A standard medical consultation service.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Service price', example: 100, required: true })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Clinic ID',
    example: '609e125f531123456789abcd',
    required: true,
  })
  @IsMongoId()
  clinic: string;

  @ApiProperty({
    description: 'List of doctor IDs',
    example: ['609e125f531123456789dcba', '609e125f531123456789dcbb'],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  doctors: string[];
}
