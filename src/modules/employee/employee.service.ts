import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiGetResponse, paginate } from '../../common/utlis/paginate';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<ApiGetResponse<Employee>> {
    const newEmployee = new this.employeeModel(createEmployeeDto);
    const savedEmployee = await newEmployee.save();
    return {
      success: true,
      message: 'Employee created successfully',
      data: savedEmployee,
    };
  }

  async getAllEmployees(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };

    const searchConditions: any[] = [];

    // Handle flexible text-based search
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i'); // case-insensitive

      searchConditions.push(
        { name: regex },
        { employeeType: regex },
        { identity: regex },
        { nationality: regex },
        { address: regex },
        { specialties: { $in: [regex] } },
        { Languages: { $in: [regex] } },
        { professional_experience: regex },
      );
    }

    // Remove search key from filters before passing it down
    delete filters.search;

    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
    };

    return paginate(
      this.employeeModel,
      [
        'companyId',
        'clinicCollectionId',
        'departmentId',
        'clinics',
        'specializations',
      ],
      page,
      limit,
      allData,
      finalFilter,
      sort,
    );
  }

  async getEmployeeById(id: string): Promise<ApiGetResponse<Employee>> {
    const employee = await this.employeeModel
      .findById(id)
      .populate([
        'companyId',
        'clinicCollectionId',
        'departmentId',
        'clinics',
        'specializations',
      ])
      .exec();
    if (!employee) throw new NotFoundException('Employee not found');
    return {
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    };
  }

  async updateEmployee(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<ApiGetResponse<Employee>> {
    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .exec();
    if (!updatedEmployee) throw new NotFoundException('Employee not found');

    return {
      success: true,
      message: 'Employee update successfully',
      data: updatedEmployee,
    };
  }

  async deleteEmployee(id: string): Promise<ApiGetResponse<Employee>> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedEmployee) throw new NotFoundException('Employee not found');
    return {
      success: true,
      message: 'Employee remove successfully',
      data: {} as Employee,
    };
  }
}
