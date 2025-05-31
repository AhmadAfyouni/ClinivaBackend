import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ContactInfoDTO } from 'src/common/utils/helper.dto';

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

  // @ApiProperty({
  //   description: 'Brief overview of the department',
  //   example: 'Specialized in heart-related treatments and procedures.',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // overview?: string;

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
    description: 'Year of establishment',
    example: '2015-04-10',
    required: false,
  })
  @IsOptional()
  @IsDate()
  yearOfEstablishment?: Date;

  @ApiProperty({
    description: 'Department address',
    example: 'Building 5, Health Complex, Riyadh, Saudi Arabia',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;
  /*
  @ApiProperty({
    description: 'Department logo URL',
    example: 'https://hospital.com/dept-logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Vision statement of the department',
    example: 'Providing world-class cardiac care to patients.',
    required: false,
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({
    description: 'Additional goals about the department',
    example: 'Equipped with state-of-the-art cardiac surgery facilities.',
    required: false,
  })
  @IsOptional()
  @IsString()
  goals?: string;
*/

  @ApiProperty({
    description: 'Patient capacity of the department',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  patientCapacity?: number;
  /*
  @ApiProperty({
      description: 'List of contact information for the department',
      type: [ContactInfoDTO],
      required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInfoDTO)
  contactInfos?: ContactInfoDTO[];*/

  @ApiProperty({
    description: 'Clinic Collection ID to which the department belongs',
    example: '60f7c7b84f1a2c001c8b4567',
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  clinicCollectionId: Types.ObjectId;

  @ApiProperty({
    description: 'List of required staff roles for the department',
    example: ['Cardiologist', 'Nurse', 'Anesthesiologist'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredStaff?: string[]; // الكادر المطلوب

  @ApiProperty({
    description: 'List of specialization IDs associated with the department ',
    example: ['60f7c7b84f1a2c001c8b4567', '60f7c7b84f1a2c001c8b4568'],
    required: true,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  specializations: Types.ObjectId[];
  @ApiProperty({
    description: 'ID of the employee assigned as the Person in Charge (PIC)',
    example: '6634dce923f91b8f7761d8f2',
    required: true,
  })
  @IsMongoId()
  PIC: string;
}
