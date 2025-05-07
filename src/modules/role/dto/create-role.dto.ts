import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PermissionsEnum } from '../../../config/permission.enum';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name', example: 'Admin', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: [String],
    enum: Object.values(PermissionsEnum),
    description: 'List of permissions associated with the role',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsEnum(PermissionsEnum, { each: true })
  permissions?: string[];

  @ApiProperty({
    description: 'Role description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Role activation status',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
