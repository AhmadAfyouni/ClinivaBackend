import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  ComplexDocument,
  Complex,
} from '../cliniccollection/schemas/cliniccollection.schema';
import {
  DepartmentDocument,
  Department,
} from '../department/schemas/department.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
import { saveFileLocally } from 'src/common/utlis/upload.util';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Complex.name)
    private clinicCollectionModel: Model<ComplexDocument>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    file: Express.Multer.File,
  ): Promise<ApiGetResponse<Employee>> {
    try {
      // Get the user to check employeeType
      const user = await this.userModel.findById(createEmployeeDto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if the employee needs to be assigned to a company, clinic, etc.
      if (
        !createEmployeeDto.companyId &&
        !createEmployeeDto.clinicCollectionId &&
        !createEmployeeDto.clinics?.length &&
        !createEmployeeDto.departmentId &&
        user.employeeType !== 'PIC' &&
        user.employeeType !== 'Administrative'
      ) {
        throw new BadRequestException(
          'The staff has not been assigned to any of these: Company, Clinic Collection, clinics, department',
        );
      }

      const publicId = await generateUniquePublicId(this.employeeModel, 'emp');
      const relativeFilePath = file
        ? saveFileLocally(file, 'employees/images')
        : '';
      const newEmployee = new this.employeeModel({
        ...createEmployeeDto,
        publicId,
        image: relativeFilePath || '',
      });
      const savedEmployee = await newEmployee.save();
      return {
        success: true,
        message: 'Employee created successfully',
        data: savedEmployee,
      };
    } catch (error) {
      console.log('error', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async getAllEmployees(paginationDto: PaginationAndFilterDto, filters: any) {
    try {
      // Validate and set default pagination parameters
      const page = Number(paginationDto.page) || 1;
      const limit = Number(paginationDto.limit) || 10;
      const allData = paginationDto.allData || false;
      const sortBy = paginationDto.sortBy || 'id';
      const order = paginationDto.order || 'desc';

      // Define allowed employee types
      const ALLOWED_EMPLOYEE_TYPES = [
        'Doctor',
        'Nurse',
        'Technician',
        'Administrative',
        'Employee',
        'PIC',
        'Other',
      ];

      // Prepare sorting
      const sort: Record<string, number> = {
        [sortBy]: order === 'asc' ? 1 : -1,
      };

      const searchConditions: any[] = [];
      const filterConditions: any[] = [];

      filterConditions.push({ deleted: false });
      // Apply boolean filter for active status
      await applyBooleanFilter(filters, 'isActive', filterConditions);

      // Validate and apply employee type filter
      if (filters.employeeType) {
        if (ALLOWED_EMPLOYEE_TYPES.includes(filters.employeeType)) {
          // Instead of filtering by employeeType in the employee document,
          // we'll need to find users with this employeeType and then filter employees
          const users = await this.userModel.find({ 
            employeeType: filters.employeeType,
            deleted: false 
          }).select('_id').lean().exec();
          
          const userIds = users.map(user => user._id);
          filterConditions.push({ userId: { $in: userIds } });
        } else {
          throw new BadRequestException(
            `Invalid employeeType. Allowed values: ${ALLOWED_EMPLOYEE_TYPES.join(', ')}`,
          );
        }
      }

      // Apply clinic ID filter
      if (filters.clinicId) {
        filterConditions.push({ clinics: filters.clinicId });
      }

      // Apply clinic collection filter
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

      // Apply department filter
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

      // Apply flexible search
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

      // Remove processed fields
      const fieldsToDelete = [
        'search',
        'isActive',
        'employeeType',
        'clinicCollectionName',
        'departmentName',
      ];
      fieldsToDelete.forEach((field) => delete filters[field]);

      // Construct final filter
      const finalFilter = {
        ...(searchConditions.length > 0 && { $or: searchConditions }),
        ...(filterConditions.length > 0 && { $and: filterConditions }),
      };

      // Paginate and return results
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
    } catch (error) {
      console.error('Error in getAllEmployees', error);
      throw new BadRequestException(
        error.message || 'Failed to retrieve employees',
      );
    }
  }

  async getEmployeeById(id: string): Promise<ApiGetResponse<Employee>> {
    try {
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
      if (!employee || employee.deleted)
        throw new NotFoundException('Employee not found or has been deleted');
      return {
        success: true,
        message: 'Employee retrieved successfully',
        data: employee,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async updateEmployee(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<ApiGetResponse<Employee>> {
    try {
      const updatedEmployee = await this.employeeModel
        .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
        .exec();
      if (!updatedEmployee || updatedEmployee.deleted)
        throw new NotFoundException('Employee not found or has been deleted');

      return {
        success: true,
        message: 'Employee update successfully',
        data: updatedEmployee,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async deleteEmployee(id: string): Promise<ApiGetResponse<Employee>> {
    try {
      const employee = await this.employeeModel.findById(id).exec();
      if (!employee || employee.deleted)
        throw new NotFoundException('Employee not found or has been deleted');

      employee.deleted = true;
      employee.name = employee.name + ' (Deleted)' + employee.publicId;
      employee.identity = employee.identity + '(Deleted)' + employee.publicId;

      const deletedEmployee = await employee.save();

      return {
        success: true,
        message: 'Employee marked as deleted successfully',
        data: deletedEmployee,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async getEmployeesWithoutUser(): Promise<ApiGetResponse<Employee[]>> {
    try {
      // First, get all user IDs that exist in the users collection
      const users = await this.userModel.find({ deleted: false }).select('_id').lean().exec();
      const userIds = users.map(user => user._id.toString());
      
      // Build the query to find employees without a valid user
      const query = {
        $or: [
          { userId: { $exists: false } },
          { userId: null },
          { userId: '' },
          { 
            $and: [
              { userId: { $exists: true } },
              { userId: { $ne: null } },
              { userId: { $ne: '' } },
              { userId: { $nin: userIds } }
            ]
          }
        ],
        deleted: false
      };

      // Execute the query
      const employees = await this.employeeModel
        .find(query)
        .populate('userId', '_id email') // Populate userId for debugging
        .lean()
        .exec();
      
      return {
        success: true,
        message: 'Employees without user retrieved successfully',
        data: employees,
      };
    } catch (error) {
      console.error('Error in getEmployeesWithoutUser:', error);
      throw new BadRequestException(error.message || 'Failed to retrieve employees without user');
    }
  }

  async findByUserId(userId: string): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ userId: new Types.ObjectId(userId), deleted: false })
      .exec();
  }
}
