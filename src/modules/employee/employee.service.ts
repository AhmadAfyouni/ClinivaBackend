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
   async getCountDoctorByClinicCollectionId(clinicCollectionId: string): Promise<ApiResponse< {count: number}>> {
      const employees = await this.employeeModel.find().
      populate({path:"clinics" ,select:"clinics",populate:{path:'departmentId',select:"clinicCollectionId", match: { clinicCollectionId: clinicCollectionId },}}).where('employeeType').equals('Doctor').lean();
      const count = employees.filter(clinic => clinic.departmentId !== null).length;
  console.log(employees)
     /*  const counts = await this.employeeModel
     .countDocuments({
        'employeeType': 'Doctor', // تصفية الموظفين الذين نوعهم "Doctor"
        'clinics.departmentId.clinicCollectionId': clinicCollectionId, // تصفية العيادات المرتبطة بالمجمع
      });*/
      return {
        success: true,
        message: 'Doctor count in Clinic Collection retrieved successfully',
        data: { count },
      };
    }
   async getCountByClinicCollectionId(clinicCollectionId: string): Promise<ApiResponse< {count: number}>> {
      const clinics = await this.employeeModel.find().
      populate({path:"clinics" ,select:"clinics",
        populate:{path:'departmentId',select:"clinicCollectionId", match: { clinicCollectionId: clinicCollectionId },}})
        .where('employeeType').ne('Doctor').lean();
      const count = clinics.filter(clinic => clinic.departmentId !== null).length;
  
  
      return {
        success: true,
        message: 'employee count in Clinic Collection retrieved successfully',
        data: { count },
      };
    }
}
