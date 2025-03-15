import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsArray, IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {ContactInfo} from '../../../common/utlis/helper';
import {Types} from 'mongoose';

export class CreateDepartmentDto {
    @ApiProperty({description: 'Department name', example: 'Cardiology Department'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        description: 'Brief introduction of the department',
        example: 'Specialized in heart-related treatments and procedures.'
    })
    @IsOptional()
    @IsString()
    introduction?: string;

    @ApiPropertyOptional({description: 'Year of establishment', example: '2015-04-10'})
    @IsOptional()
    @IsDate()
    yearOfEstablishment?: Date;

    @ApiProperty({description: 'Department address', example: 'Building 5, Health Complex, Riyadh, Saudi Arabia'})
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiPropertyOptional({description: 'Department logo URL', example: 'https://hospital.com/dept-logo.png'})
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional({
        description: 'Vision statement of the department',
        example: 'Providing world-class cardiac care to patients.'
    })
    @IsOptional()
    @IsString()
    vision?: string;

    @ApiPropertyOptional({
        description: 'Additional details about the department',
        example: 'Equipped with state-of-the-art cardiac surgery facilities.'
    })
    @IsOptional()
    @IsString()
    details?: string;

    @ApiPropertyOptional({
        type: [ContactInfo],
        description: 'Contact information of the department',
        example: [
            {type: 'phone', value: '+966501234567', isPublic: true, subType: 'work'},
            {type: 'email', value: 'cardiology@hospital.com', isPublic: true, subType: 'corporate'}
        ]
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ContactInfo)
    @IsOptional()
    ContactInfos?: ContactInfo[];

    @ApiProperty({
        description: 'Clinic Collection ID to which the department belongs',
        example: '60f7c7b84f1a2c001c8b4567'
    })
    @IsMongoId()
    @IsNotEmpty()
    clinicCollectionId: Types.ObjectId;
}
