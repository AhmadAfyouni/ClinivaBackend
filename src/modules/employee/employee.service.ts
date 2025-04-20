import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiGetResponse, paginate } from '../../common/utlis/paginate';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';
import { ClinicCollectionDocument,ClinicCollection } from '../cliniccollection/schemas/cliniccollection.schema';
import { DepartmentDocument,Department } from '../department/schemas/department.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(ClinicCollection.name) private clinicCollectionModel: Model<ClinicCollectionDocument>,
    @InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<ApiGetResponse<Employee>> {
    const publicId = await generateUniquePublicId(this.employeeModel, 'emp'); 
    const newEmployee = new this.employeeModel({
      ...createEmployeeDto,
      publicId
    });
    const savedEmployee = await newEmployee.save();
    return {
      success: true,
      message: 'Employee created successfully',
      data: savedEmployee,
    };
  }

  async getAllEmployees(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;
  
    page = Number(page) || 1;
    limit = Number(limit) || 10;
  
    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
  
    const searchConditions: any[] = [];
    const filterConditions: any[] = [];
    const allowedEmployeeTypes = ['Doctor', 'Nurse', 'Technician', 'Administrative', 'Employee', 'Other'];
  
    // معالجة isActive
    if (filters.hasOwnProperty('isActive')) {
      const isActiveValue = 
        filters.isActive === 'null' ? null : 
        filters.isActive === 'true' ? true : 
        filters.isActive === 'false' ? false : 
        filters.isActive;
  
      if (isActiveValue === null) {
        // لا تفعل أي شيء (تجاهل الفلتر)
      } else if (typeof isActiveValue === 'boolean') {
        filterConditions.push({ isActive: isActiveValue });
      } else {
        throw new Error(`Invalid isActive value. Allowed values: true, false, null`);
      }
    }
  
    // معالجة employeeType
    if (filters.employeeType) {
      if (allowedEmployeeTypes.includes(filters.employeeType)) {
        filterConditions.push({ employeeType: filters.employeeType });
      } else {
        throw new Error(`Invalid employeeType. Allowed values: ${allowedEmployeeTypes.join(', ')}`);
      }
    }
  
        // فلترة حسب نوع الموظف
      
      
        // فلترة حسب اسم المجمع الطبي
        if (filters.clinicCollectionName) {

      
          // البحث في المجمعات الطبية
          const clinics = await this.clinicCollectionModel.findOne({ name: filters.clinicCollectionName }).select('_id');
         
      
          // إضافة شرط البحث حسب المجمع الطبي
          if (clinics) {
            filterConditions.push({ clinicCollectionId: clinics._id.toString() });
          } else {
            return { data: [], total: 0, page, limit, totalPages: 0 };
          }
        }
      
        // فلترة حسب اسم القسم
        if (filters.departmentName) {
          // البحث عن القسم المطابق تمامًا
          const department = await this.departmentModel
            .findOne({ name: filters.departmentName })
            .select('_id');
        
          if (department) {
            filterConditions.push({ departmentId: department._id.toString() });
          } else {
            // ما في قسم بهذا الاسم
            return {
              data: [],
              total: 0,
              page,
              limit,
              totalPages: 0
            };
          }
        }
        
      
        // Handle flexible text-based search في الموظفين
        if (filters.search) {
          const regex = new RegExp(filters.search, 'i'); // case-insensitive
      
          searchConditions.push(
            { name: regex },
            { identity: regex },
            { nationality: regex },
            { address: regex },
            { specialties: { $in: [regex] } },
            { Languages: { $in: [regex] } },
            { professional_experience: regex },
          );
        }
      
    
  
    // إزالة جميع الحقول المعالجة من الفلاتر
    const fieldsToDelete = ['search', 'isActive', 'employeeType', 'clinicCollectionName', 'departmentName'];
    fieldsToDelete.forEach(field => delete filters[field]);
  
    // بناء الفلتر النهائي بدون ...filters
    const finalFilter = {
      ...(searchConditions.length > 0 && { $or: searchConditions }),
      ...(filterConditions.length > 0 && { $and: filterConditions })
    };
  
    return paginate(
      this.employeeModel,
      [
        'companyId',
        { path: 'clinicCollectionId', select: 'name' },
        { path: 'departmentId', select: 'name' },
        'clinics',
        'specializations',
      ],
      page,
      limit,
      allData,
      finalFilter, // تم إزالة ...filters هنا
      sort
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
