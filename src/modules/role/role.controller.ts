import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {RoleService} from './role.service';
import {Role} from './schemas/role.schema';
import {CreateRoleDto} from "./dto/create-role.dto";
import {UpdateRoleDto} from "./dto/update-role.dto";
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {
    }

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.createRole(createRoleDto);
    }

    @Get()
    async getAllRoles(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
        const { page, limit, allData, sortBy, order, ...filters } = queryParams;

        return this.roleService.getAllRoles(paginationDto, filters);
    }

    @Get(':id')
    async getRoleById(@Param('id') id: string) {
        return this.roleService.getRoleById(id);
    }

    @Put(':id')
    async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.updateRole(id, updateRoleDto);
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: string) {
        return this.roleService.deleteRole(id);
    }
}
