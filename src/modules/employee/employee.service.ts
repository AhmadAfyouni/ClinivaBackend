import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiResponse, paginate } from '../../common/utlis/paginate';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';


@Injectable()
export class EmployeeService {
  constructor(@InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>) {
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<ApiResponse<Employee>> {
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
    const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
    return paginate(this.employeeModel, ['companyId', 'clinicCollectionId', 'departmentId',
      'clinics','specializations'], page, limit, allData, filters, sort);
  }

  async getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
    const employee = await this.employeeModel.findById(id).populate(['companyId', 'clinicCollectionId', 'departmentId',
      'clinics','specializations']).exec();
    if (!employee) throw new NotFoundException('Employee not found');
    return {
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    };
  }

  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<ApiResponse<Employee>> {
    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, { new: true }).exec();
    if (!updatedEmployee) throw new NotFoundException('Employee not found');

    return {
      success: true,
      message: 'Employee update successfully',
      data: updatedEmployee,
    };
  }

  async deleteEmployee(id: string): Promise<ApiResponse<Employee>> {
    const deletedEmployee = await this.employeeModel.findByIdAndDelete(id).exec();
    if (!deletedEmployee) throw new NotFoundException('Employee not found');
    return {
      success: true,
      message: 'Employee remove successfully',
    };
  }
  async getCountDoctorByClinicCollectionId(clinicCollectionId: string): Promise<ApiResponse< {count: any}>> {
    
    const employees = await this.employeeModel
    .find().select("clinics employeeType").where('employeeType').equals('Doctor')
    .populate({
      path: 'clinics',
      select:"departmentId" ,
      populate: {
        path: 'departmentId',
        select:"clinicCollectionId" ,
        match: { clinicCollectionId: clinicCollectionId }, },
    })
    .exec();
  
    const filteredEmployees = employees.filter(emp => emp.clinics?.some(clinic => (clinic as any ).departmentId?.clinicCollectionId))
    
    const uniqueEmployeeIds = new Set(
     filteredEmployees.map(emp => emp._id.toString()) // تحويل _id إلى string لمنع التكرار
   );
    return {
      success: true,
      message: 'Doctor count in Clinic Collection retrieved successfully',
      data: { count:uniqueEmployeeIds.size },
    };
  }

  async getCounetEmployeeByClinicCollectionId(clinicCollectionId: string): Promise<ApiResponse< {count: number}>> {
    const employees = await this.employeeModel
    .find().select("clinics employeeType").where('employeeType').ne('Doctor')
    .populate({
      path: 'clinics',
      select:"departmentId" ,
      populate: {
        path: 'departmentId',
        select:"clinicCollectionId" ,
        match: { clinicCollectionId: clinicCollectionId }, },
    })
    .exec();
  
    const filteredEmployees = employees.filter(emp => emp.clinics?.some(clinic => (clinic as any ).departmentId?.clinicCollectionId))
    
    const uniqueEmployeeIds = new Set(
     filteredEmployees.map(emp => emp._id.toString()) // 
   );
   //يجب اضافة الموظفين الذين يعملون ب قسم ومجمع
   console.log(uniqueEmployeeIds)
     return {
       success: true,
       message: 'employee count in Clinic Collection retrieved successfully',
       data: { count:uniqueEmployeeIds.size },
      };
   }
}
