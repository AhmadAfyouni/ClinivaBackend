import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
@Controller('roles')
@UseGuards(PermissionsGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  @Post()
    @Permissions(PermissionsEnum.ADMIN)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
    @Permissions(PermissionsEnum.ADMIN)
  async getAllRoles(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.roleService.getAllRoles(paginationDto, filters);
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @Put(':id')
    @Permissions(PermissionsEnum.ADMIN)
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
    @Permissions(PermissionsEnum.ADMIN)
  async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
