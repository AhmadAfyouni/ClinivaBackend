import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsArray, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {PermissionsEnum} from '../../../config/permission.enum';

export class CreateRoleDto {
    @ApiProperty({description: 'Role name', example: 'Admin'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        type: [String],
        enum: Object.values(PermissionsEnum),
        description: 'List of permissions associated with the role'
    })
    @IsArray()
    @IsOptional()
    @IsEnum(PermissionsEnum, {each: true})
    permissions?: string[];

    @ApiPropertyOptional({type: [String], description: 'List of permission groups associated with the role'})
    @IsArray()
    @IsOptional()
    @IsString({each: true})
    permissionGroups?: string[];

    @ApiPropertyOptional({description: 'Role description'})
    @IsOptional()
    @IsString()
    description?: string;
}