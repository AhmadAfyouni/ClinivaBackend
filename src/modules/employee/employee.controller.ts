import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {EmployeeService} from './employee.service';
import {Employee} from './schemas/employee.schema';
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {
    }

    @Post()
    async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        return this.employeeService.createEmployee(createEmployeeDto);
    }

    @Get()
    async getAllEmployees(): Promise<Employee[]> {
        return this.employeeService.getAllEmployees();
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
