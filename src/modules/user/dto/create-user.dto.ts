import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength
} from 'class-validator';
import { Types } from 'mongoose';
import { ActivityLog, LoginHistory } from 'src/common/utlis/helper';

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
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'User activation status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'List of role IDs assigned to the user',
    example: ['60f7c7b84f1a2c001c8b4567'],
    required: true,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  roleIds: Types.ObjectId[];

    @ApiProperty({
        description: 'Employee ID',
        example: '60f7c7b84f1a2c001c8b4572',
        required: true
    })
    @IsMongoId()
    @IsNotEmpty()
    employeeId: Types.ObjectId;
    @ApiProperty({
        description: 'Last login timestamp of the user',
        example: '2025-03-01T12:00:00Z',
        required: false
    })
    @IsDate()
    @IsOptional()
    lastLoginAt?: Date;

    @ApiProperty({
        description: 'Timestamp of the last password update',
        example: '2025-03-01T12:00:00Z',
        required: false
    })
    @IsDate()
    @IsOptional()
    lastPasswordUpdate?: Date;
       
    @ApiProperty({
        type: [ActivityLog],
        description: 'Activity log of the user',
        example: [{ activityDate: '2025-03-01T12:00:00Z', description: 'User logged in' }],
        required: false
    })
    @IsArray()
    @IsOptional()
    activityLog?: ActivityLog[];

    @ApiProperty({
        type: [LoginHistory],
        description: 'Login history of the user with IP address and device',
        example: [LoginHistory],
        required: false
    })
    @IsArray()
    @IsOptional()
    loginHistory?: { loginDate: Date; ipAddress: string; device: string }[];


}
