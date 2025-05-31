import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiGetResponse, paginate, SortType } from 'src/common/utils/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async createRole(
    createRoleDto: CreateRoleDto,
  ): Promise<ApiGetResponse<Role>> {
    try {
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
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getAllRoles(paginationDto: PaginationAndFilterDto, filters: any) {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField = sortBy ?? 'id';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };

      return paginate({
        model: this.roleModel,
        populate: [],
        page,
        limit,
        allData,
        filter: filters,
        sort: sort,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getRoleById(id: string): Promise<ApiGetResponse<Role>> {
    try {
      const role = await this.roleModel.findById(id);
      if (!role) throw new NotFoundException('Role not found');
      return {
        success: true,
        message: 'role retrieved successfully',
        data: role,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<ApiGetResponse<Role>> {
    try {
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
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteRole(id: string): Promise<ApiGetResponse<Role>> {
    try {
      await this.roleModel.findByIdAndDelete(id);
      return {
        success: true,
        message: 'Role remove successfully',
        data: {} as Role,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
