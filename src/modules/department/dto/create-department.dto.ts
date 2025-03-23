import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsMongoId,
    IsNotEmpty, IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContactInfo } from '../../../common/utlis/helper';
import { Types } from 'mongoose';

export class CreateDepartmentDto {
    @ApiProperty({ description: 'Department name', example: 'Cardiology Department', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Brief overview of the department',
        example: 'Specialized in heart-related treatments and procedures.',
        required: false
    })
    @IsOptional()
    @IsString()
    overview?: string;

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
        required: false
    })
    @IsOptional()
    @IsDate()
    yearOfEstablishment?: Date;

    @ApiProperty({ description: 'Department address', example: 'Building 5, Health Complex, Riyadh, Saudi Arabia', required: true })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: 'Department logo URL',
        example: 'https://hospital.com/dept-logo.png',
        required: false
    })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiProperty({
        description: 'Vision statement of the department',
        example: 'Providing world-class cardiac care to patients.',
        required: false
    })
    @IsOptional()
    @IsString()
    vision?: string;

    @ApiProperty({
        description: 'Additional goals about the department',
        example: 'Equipped with state-of-the-art cardiac surgery facilities.',
        required: false
    })
    @IsOptional()
    @IsString()
    goals?: string;

    @ApiProperty({
        type: [ContactInfo],
        description: 'Contact information of the department',
        required: false,
        example: [
            { type: 'phone', value: '+966501234567', isPublic: true, subType: 'work' },
            { type: 'email', value: 'cardiology@hospital.com', isPublic: true, subType: 'corporate' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactInfo)
    @IsOptional()
    ContactInfos?: ContactInfo[];

    @ApiProperty({
        description: 'Maximum number of patients allowed',
        example: 50,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    patientCapacity?: number;

    @ApiProperty({
        description: 'Clinic Collection ID to which the department belongs',
        example: '60f7c7b84f1a2c001c8b4567',
        required: true
    })
    @IsMongoId()
    @IsNotEmpty()
    clinicCollectionId: Types.ObjectId;
}
