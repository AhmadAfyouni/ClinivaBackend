import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import {PermissionsGroupEnum} from "../../config/permissions-group.enum";
import {CreateRoleDto} from "./dto/create-role.dto";
import {UpdateRoleDto} from "./dto/update-role.dto";

@Injectable()
export class RoleService {
    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

    async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
        const { name, permissions = [], permissionGroups = [] } = createRoleDto;

        // استخراج جميع الصلاحيات من المجموعات المحددة
        const expandedPermissions = permissionGroups.flatMap(group => PermissionsGroupEnum[group] || []);

        // إزالة التكرارات
        const uniquePermissions = Array.from(new Set([...permissions, ...expandedPermissions]));

        const newRole = new this.roleModel({ name, permissions: uniquePermissions, permissionGroups });
        return newRole.save();
    }

    async getAllRoles(): Promise<Role[]> {
        return this.roleModel.find().exec();
    }

    async getRoleById(id: string): Promise<Role> {
        const role = await this.roleModel.findById(id);
        if (!role) throw new NotFoundException('Role not found');
        return role;
    }

    async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const role = await this.roleModel.findById(id).exec();
        if (!role) throw new NotFoundException('Role not found');

        const { permissions = role.permissions, permissionGroups = role.permissionGroups } = updateRoleDto;

        // تحديث الصلاحيات بناءً على المجموعات المحددة
        const expandedPermissions = permissionGroups.flatMap(group => PermissionsGroupEnum[group] || []);
        const uniquePermissions = Array.from(new Set([...permissions, ...expandedPermissions]));

        role.permissions = uniquePermissions;
        role.permissionGroups = permissionGroups;

        return role.save();
    }

    async deleteRole(id: string): Promise<void> {
        await this.roleModel.findByIdAndDelete(id);
    }
}
