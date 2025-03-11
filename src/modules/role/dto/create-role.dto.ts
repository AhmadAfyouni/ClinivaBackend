import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import {PermissionsEnum} from "../../../config/permission.enum";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string; // اسم الدور

    @IsOptional()
    @IsArray()
    permissions?: PermissionsEnum[]; // قائمة بالصلاحيات الفردية

    @IsOptional()
    @IsArray()
    permissionGroups?: string[]; // قائمة بمجموعات الصلاحيات
}

