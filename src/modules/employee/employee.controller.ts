import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {EmployeeService} from './employee.service';
import {Employee} from './schemas/employee.schema';
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {PaginationAndFilterDto} from "../../common/dtos/pagination-filter.dto";

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {
    }

    @Post()
    async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        return this.employeeService.createEmployee(createEmployeeDto);
    }

    @Get()
    async getAllEmployees(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
        const { page, limit, allData, sortBy, order, ...filters } = queryParams;

        return this.employeeService.getAllEmployees(paginationDto, filters);
    }


    @Get(':id')
    async getEmployeeById(@Param('id') id: string): Promise<Employee> {
        return this.employeeService.getEmployeeById(id);
    }

    @Put(':id')
    async updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        return this.employeeService.updateEmployee(id, updateEmployeeDto);
    }

    @Delete(':id')
    async deleteEmployee(@Param('id') id: string): Promise<void> {
        return this.employeeService.deleteEmployee(id);
    }
}
