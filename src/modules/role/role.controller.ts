import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {RoleService} from './role.service';
import {Role} from './schemas/role.schema';
import {CreateRoleDto} from "./dto/create-role.dto";
import {UpdateRoleDto} from "./dto/update-role.dto";

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {
    }

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return this.roleService.createRole(createRoleDto);
    }

    @Get()
    async getAllRoles(): Promise<Role[]> {
        return this.roleService.getAllRoles();
    }

    @Get(':id')
    async getRoleById(@Param('id') id: string): Promise<Role> {
        return this.roleService.getRoleById(id);
    }

    @Put(':id')
    async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
        return this.roleService.updateRole(id, updateRoleDto);
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: string): Promise<void> {
        return this.roleService.deleteRole(id);
    }
}
