import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DepartmentService } from './department.service';
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {UpdateDepartmentDto} from "./dto/update-department.dto";

@Controller('departments')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}

    @Post()
    async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
        return this.departmentService.createDepartment(createDepartmentDto);
    }

    @Get()
    async getAllDepartments() {
        return this.departmentService.getAllDepartments();
    }

    @Get(':id')
    async getDepartmentById(@Param('id') id: string) {
        return this.departmentService.getDepartmentById(id);
    }

    @Put(':id')
    async updateDepartment(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
        return this.departmentService.updateDepartment(id, updateDepartmentDto);
    }

    @Delete(':id')
    async deleteDepartment(@Param('id') id: string) {
        return this.departmentService.deleteDepartment(id);
    }
}
