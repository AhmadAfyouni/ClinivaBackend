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
  
    // تحويل الصفحة والحد إلى أرقام
    page = Number(page) || 1;
    limit = Number(limit) || 10;
  
    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
  
    const searchConditions: any[] = [];
    const filterConditions: any[] = [];
    const allowedStatuses = ['true', 'false'];
    const allowedEmployeeTypes = [
      'Doctor',
      'Nurse',
      'Technician',
      'Administrative',
      'Employee',
      'Other',
    ];
  
    // فلترة حسب الحالة النشطة
    if (filters.isActive) {
      if (allowedStatuses.includes(filters.isActive)) {
        filterConditions.push({ isActive: filters.isActive });
      } else {
        throw new Error(`Invalid status value. Allowed values: ${allowedStatuses.join(', ')}`);
      }
    }
  
    // فلترة حسب نوع الموظف
    if (filters.employeeType) {
      if (allowedEmployeeTypes.includes(filters.employeeType)) {
        filterConditions.push({ employeeType: filters.employeeType });
      } else {
        throw new Error(`Invalid employeeType value. Allowed values: ${allowedEmployeeTypes.join(', ')}`);
      }
    }
  
    // فلترة حسب اسم المجمع الطبي
    if (filters.clinicCollectionName) {
      const searchRegex = new RegExp(filters.clinicCollectionName, 'i'); // case-insensitive
  
      // البحث في المجمعات الطبية
      const clinics = await this.clinicCollectionModel.find({ name: searchRegex }).select('_id');
      const clinicIds = clinics.map(clinic => clinic._id.toString());
  
      // إضافة شرط البحث حسب المجمع الطبي
      if (clinicIds.length) {
        filterConditions.push({ clinicCollectionId: { $in: clinicIds } });
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
  
    // إزالة الحقول من الفلاتر بعد المعالجتها
    delete filters.search;
    delete filters.isActive;
    delete filters.employeeType;
    delete filters.clinicCollectionName; // حذف فلتر اسم المجمع الطبي
    delete filters.departmentName; // حذف فلتر اسم القسم
  
    // دمج الفلاتر النهائية
    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
      ...(filterConditions.length > 0 ? { $and: filterConditions } : {}),
    };
  
    // تنفيذ الاستعلام باستخدام الـ pagination والـ populate
    return paginate(
      this.employeeModel,
      [
        'companyId',
      
        { path: 'clinicCollectionId', select: 'name' }, // populate بيانات المجمع الطبي
        { path: 'departmentId', select: 'name' }, // تضمين بيانات القسم
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
