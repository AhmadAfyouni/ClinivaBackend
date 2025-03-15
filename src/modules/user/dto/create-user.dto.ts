import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsArray, IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Types} from 'mongoose';

export class CreateUserDto {
    @ApiProperty({description: 'User name', example: 'John Doe'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({description: 'User email (unique)', example: 'john.doe@example.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({description: 'User password', example: 'securePassword123'})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiPropertyOptional({description: 'User activation status', example: true})
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({description: 'List of role IDs assigned to the user', example: ['60f7c7b84f1a2c001c8b4567']})
    @IsArray()
    @IsMongoId({each: true})
    @IsNotEmpty()
    roleIds: Types.ObjectId[];

    @ApiPropertyOptional({description: 'Company ID where the user works', example: '60f7c7b84f1a2c001c8b4568'})
    @IsMongoId()
    @IsOptional()
    companyId?: Types.ObjectId;

    @ApiPropertyOptional({
        description: 'Clinic Collection ID where the user works',
        example: '60f7c7b84f1a2c001c8b4569'
    })
    @IsMongoId()
    @IsOptional()
    clinicCollectionId?: Types.ObjectId;

    @ApiPropertyOptional({description: 'Department ID where the user works', example: '60f7c7b84f1a2c001c8b4570'})
    @IsMongoId()
    @IsOptional()
    departmentId?: Types.ObjectId;

    @ApiPropertyOptional({
        type: [String],
        description: 'List of clinic IDs where the user works',
        example: ['60f7c7b84f1a2c001c8b4571']
    })
    @IsArray()
    @IsMongoId({each: true})
    @IsOptional()
    clinics?: Types.ObjectId[];

    @ApiPropertyOptional({description: 'Employee ID if the user is an employee', example: '60f7c7b84f1a2c001c8b4572'})
    @IsMongoId()
    @IsOptional()
    employeeId?: Types.ObjectId;
}
