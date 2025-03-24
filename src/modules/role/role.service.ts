import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<ApiResponse<Role>> {
    const { name, permissions = [] } = createRoleDto;

    const uniquePermissions = Array.from(new Set(permissions));

    const newRole = new this.roleModel({
      name,
      permissions: uniquePermissions,
    });
    const savedRole = await newRole.save();

    return {
      success: true,
      message: 'role created successfully',
      data: savedRole,
    };
  }

  async getAllRoles(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField = sortBy ?? 'createdAt';
    const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };

    return paginate(this.roleModel, [], page, limit, allData, filters, sort);
  }

  async getRoleById(id: string): Promise<ApiResponse<Role>> {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Role not found');
    return {
      success: true,
      message: 'role retrieved successfully',
      data: role,
    };
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<ApiResponse<Role>> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) throw new NotFoundException('Role not found');

    const { permissions = role.permissions } = updateRoleDto;

    role.permissions = Array.from(new Set(permissions));
    const savedRole = await role.save();
    return {
      success: true,
      message: 'Role update successfully',
      data: savedRole,
    };

  }

  async deleteRole(id: string): Promise<ApiResponse<Role>> {
    await this.roleModel.findByIdAndDelete(id);
    return {
      success: true,
      message: 'Role remove successfully',
    };
  }
}
