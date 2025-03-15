import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Employee, EmployeeDocument} from './schemas/employee.schema';
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";

@Injectable()
export class EmployeeService {
    constructor(@InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>) {
    }

    async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const newEmployee = new this.employeeModel(createEmployeeDto);
        return newEmployee.save();
    }

    async getAllEmployees(): Promise<Employee[]> {
        return this.employeeModel.find().exec();
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employee = await this.employeeModel.findById(id).exec();
        if (!employee) throw new NotFoundException('Employee not found');
        return employee;
    }

    async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        const updatedEmployee = await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, {new: true}).exec();
        if (!updatedEmployee) throw new NotFoundException('Employee not found');
        return updatedEmployee;
    }

    async deleteEmployee(id: string): Promise<void> {
        const deletedEmployee = await this.employeeModel.findByIdAndDelete(id).exec();
        if (!deletedEmployee) throw new NotFoundException('Employee not found');
    }
}
