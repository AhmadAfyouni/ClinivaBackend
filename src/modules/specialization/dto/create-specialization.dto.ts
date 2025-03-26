import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsArray } from 'class-validator';

export class CreateSpecializationDto {
  @ApiProperty({ example: 'Cardiology', description: 'The name of the medical specialization' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Specialized in heart diseases', description: 'A brief description of the specialization' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['ECG Machine', 'Echocardiogram'], description: 'The required equipment for the specialization' })
  @IsArray()
  @IsString({ each: true })
  requiredEquipment: string[];

  @ApiProperty({ example: ['Cardiologist', 'Nurse'], description: 'The staff required for this specialization' })
  @IsArray()
  @IsString({ each: true })
  requiredStaff: string[];

  @ApiProperty({ example: ['Heart Surgery', 'Angioplasty'], description: 'The medical procedures related to this specialization' })
  @IsArray()
  @IsString({ each: true })
  medicalProcedures: string[];

  @ApiProperty({ example: 'Board Certified in Cardiology', description: 'Certification requirements for the specialization' })
  @IsString()
  certificationRequirements: string;

  @ApiProperty({ example: true, description: 'Indicates whether the specialization is active' })
  @IsBoolean()
  isActive: boolean;
}
