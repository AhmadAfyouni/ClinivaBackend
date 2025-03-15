import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
    @ApiProperty({ description: 'User name', example: 'John Doe', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'User email (unique)', example: 'john.doe@example.com', required: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'User password', example: 'securePassword123', required: true })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'User activation status',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({
        description: 'List of role IDs assigned to the user',
        example: ['60f7c7b84f1a2c001c8b4567'],
        required: true
    })
    @IsArray()
    @IsMongoId({ each: true })
    @IsNotEmpty()
    roleIds: Types.ObjectId[];

    @ApiProperty({
        description: 'Company ID where the user works',
        example: '60f7c7b84f1a2c001c8b4568',
        required: false
    })
    @IsMongoId()
    @IsOptional()
    companyId?: Types.ObjectId;

    @ApiProperty({
        description: 'Clinic Collection ID where the user works',
        example: '60f7c7b84f1a2c001c8b4569',
        required: false
    })
    @IsMongoId()
    @IsOptional()
    clinicCollectionId?: Types.ObjectId;

    @ApiProperty({
        description: 'Department ID where the user works',
        example: '60f7c7b84f1a2c001c8b4570',
        required: false
    })
    @IsMongoId()
    @IsOptional()
    departmentId?: Types.ObjectId;

    @ApiProperty({
        type: [String],
        description: 'List of clinic IDs where the user works',
        example: ['60f7c7b84f1a2c001c8b4571'],
        required: false
    })
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    clinics?: Types.ObjectId[];

    @ApiProperty({
        description: 'Employee ID',
        example: '60f7c7b84f1a2c001c8b4572',
        required: true
    })
    @IsMongoId()
    @IsNotEmpty()
    employeeId: Types.ObjectId;
}
