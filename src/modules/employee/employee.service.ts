import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  ApiGetResponse,
  paginate,
  applyModelFilter,
  applyBooleanFilter,
} from '../../common/utlis/paginate';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';
import {
  ClinicCollectionDocument,
  ClinicCollection,
} from '../cliniccollection/schemas/cliniccollection.schema';
import {
  DepartmentDocument,
  Department,
} from '../department/schemas/department.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(ClinicCollection.name)
    private clinicCollectionModel: Model<ClinicCollectionDocument>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<ApiGetResponse<Employee>> {
    const publicId = await generateUniquePublicId(this.employeeModel, 'emp');
    const newEmployee = new this.employeeModel({
      ...createEmployeeDto,
      publicId,
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
    console.log(filters);
    console.log(filters);
    const sortField: string = sortBy ?? 'id';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };

    const searchConditions: any[] = [];
    const filterConditions: any[] = [];
    const allowedEmployeeTypes = [
      'Doctor',
      'Nurse',
      'Technician',
      'Administrative',
      'Employee',
      'PIC',
      'Other',
    ];

    // معالجة isActive
    await applyBooleanFilter(filters, 'isActive', filterConditions);

    // employeeType
    if (filters.employeeType) {
      if (filters.employeeType === 'null') {
      } else if (allowedEmployeeTypes.includes(filters.employeeType)) {
        filterConditions.push({ employeeType: filters.employeeType });
      } else {
        throw new BadRequestException(
          `Invalid employeeType. Allowed values: ${allowedEmployeeTypes.join(', ')}`,
        );
      }
    }

    // filter by clinic id
    if (filters.clinicId) {
      filterConditions.push({ clinics: filters.clinicId });
      delete filters.clinicId;
    }

    // استخدام الدالة الموحدة لفلترة المجمع الطبي
    const clinicResult = await applyModelFilter(
      this.clinicCollectionModel,
      filters,
      'clinicCollectionName',
      'name',
      'clinicCollectionId',
      filterConditions,
      page,
      limit,
    );
    if (clinicResult) return clinicResult;

    // استخدام الدالة الموحدة لفلترة القسم
    const departmentResult = await applyModelFilter(
      this.departmentModel,
      filters,
      'departmentName',
      'name',
      'departmentId',
      filterConditions,
      page,
      limit,
    );
    if (departmentResult) return departmentResult;

    // البحث المرن
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
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

    // حذف الحقول بعد معالجتها
    const fieldsToDelete = [
      'search',
      'isActive',
      'employeeType',
      'clinicCollectionName',
      'departmentName',
    ];
    fieldsToDelete.forEach((field) => delete filters[field]);

    const finalFilter = {
      ...(searchConditions.length > 0 && { $or: searchConditions }),
      ...(filterConditions.length > 0 && { $and: filterConditions }),
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

  async getEmployeesWithoutUser(): Promise<ApiGetResponse<Employee[]>> {
    // fetch all user-linked employee IDs
    const users = await this.userModel.find().select('employeeId').exec();
    const userEmpIds = users.map((u) => u.employeeId.toString());
    // find employees not in user table
    const employees = await this.employeeModel
      .find({
        _id: { $nin: userEmpIds },
      })
      .exec();
    return {
      success: true,
      message: 'Employees without user retrieved successfully',
      data: employees,
    };
  }
}
