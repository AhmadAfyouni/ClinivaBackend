import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
  SortType,
} from '../../common/utils/paginate';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';
import {
  ComplexDocument,
  Complex,
} from '../cliniccollection/schemas/cliniccollection.schema';
import {
  DepartmentDocument,
  Department,
} from '../department/schemas/department.schema';
import { generateUniquePublicId } from 'src/common/utils/id-generator';
import { saveFileLocally } from 'src/common/utils/upload.util';
import * as bcrypt from 'bcrypt';
import { Role, RoleDocument } from '../role/schemas/role.schema';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Complex.name)
    private clinicCollectionModel: Model<ComplexDocument>,
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    file: Express.Multer.File,
    workPermit: Express.Multer.File,
    CV: Express.Multer.File,
    certifications: Express.Multer.File,
    employmentContract: Express.Multer.File,
  ): Promise<ApiGetResponse<Employee>> {
    try {
      // Get the user to check employeeType
      // const user = await this.userModel.findById(createEmployeeDto.userId);
      // if (!user) {
      //   throw new NotFoundException('User not found');
      // }

      // Check if the employee needs to be assigned to a company, clinic, etc.
      // if (
      //   !createEmployeeDto.companyId &&
      //   !createEmployeeDto.clinicCollectionId &&
      //   !createEmployeeDto.clinics?.length &&
      //   !createEmployeeDto.departmentId &&
      //   createEmployeeDto.employeeType !== 'PIC' &&
      //   createEmployeeDto.employeeType !== 'Admin'
      // ) {
      //   throw new BadRequestException(
      //     'The staff has not been assigned to any of these: Company, Clinic Collection, clinics, department',
      //   );
      // }
      const requiredFields = ['name', 'password', 'email', 'employeeType'];
      const missingFields = requiredFields.filter(
        (field) => !createEmployeeDto[field],
      );

      if (missingFields.length > 0) {
        throw new BadRequestException(
          `Missing required fields: ${missingFields.join(', ')}`,
        );
      }
      const publicId = await generateUniquePublicId(this.employeeModel, 'emp');
      const relativeFilePath = file
        ? saveFileLocally(file, 'employees/images')
        : '';
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createEmployeeDto.password,
        saltRounds,
      );
      const newEmployee = new this.employeeModel({
        ...createEmployeeDto,
        publicId,
        password: hashedPassword,
        image: relativeFilePath || '',
        workPermit: workPermit
          ? saveFileLocally(workPermit, 'employees/workPermits')
          : '',
        CV: CV ? saveFileLocally(CV, 'employees/CVs') : '',
        certifications: certifications
          ? saveFileLocally(certifications, 'employees/certifications')
          : '',
        employmentContract: employmentContract
          ? saveFileLocally(employmentContract, 'employees/employmentContracts')
          : '',
      });
      const savedEmployee = await newEmployee.save();
      return {
        success: true,
        message: 'The addition has been completed successfully',
        data: savedEmployee,
      };
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(error.message);
    }
  }

  async createUser(
    file: Express.Multer.File,
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<ApiGetResponse<Employee>> {
    try {
      const requiredFields = ['name', 'password', 'email'];
      const missingFields = requiredFields.filter(
        (field) => !createEmployeeDto[field],
      );

      if (missingFields.length > 0) {
        throw new BadRequestException(
          `Missing required fields: ${missingFields.join(', ')}`,
        );
      }
      const publicId = await generateUniquePublicId(this.employeeModel, 'emp');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createEmployeeDto.password,
        saltRounds,
      );
      const relativeFilePath = file
        ? saveFileLocally(file, 'employees/images')
        : '';
      const employeeType =
        'employeeType' in createEmployeeDto
          ? createEmployeeDto.employeeType
          : 'Staff';
      let role;
      if (employeeType === 'Admin') {
        role = await this.roleModel.findOne({ name: 'Admin' });
        if (!role) throw new InternalServerErrorException('No Roles Found');
        // createEmployeeDto.identity = '(Admin)-' + publicId;
        createEmployeeDto.Owner = true;
      }

      const newEmployee = new this.employeeModel({
        ...createEmployeeDto,
        employeeType,
        image: relativeFilePath || '',
        publicId,
        password: hashedPassword,
        roleIds: role ? [role._id] : [],
      });
      const savedEmployee = await newEmployee.save();
      return {
        success: true,
        message: 'The addition has been completed successfully',
        data: savedEmployee,
      };
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(error.message);
    }
  }

  // async getAllEmployees(paginationDto: PaginationAndFilterDto, filters: any) {
  //   try {
  //     // Validate and set default pagination parameters
  //     const page = Number(paginationDto.page) || 1;
  //     const limit = Number(paginationDto.limit) || 10;
  //     const allData = paginationDto.allData || false;
  //     const sortBy = paginationDto.sortBy || 'id';
  //     const order = paginationDto.order || 'desc';

  //     // Define allowed employee types
  //     const ALLOWED_EMPLOYEE_TYPES = [
  //       'Doctor',
  //       'Nurse',
  //       'Technician',
  //       'Administrative',
  //       'Employee',
  //       'PIC',
  //       'Other',
  //     ];

  //     // Prepare sorting
  //     const sort: Record<string, number> = {
  //       [sortBy]: order === 'asc' ? 1 : -1,
  //     };

  //     const searchConditions: any[] = [];
  //     const filterConditions: any[] = [];

  //     filterConditions.push({ deleted: false });
  //     // Apply boolean filter for active status
  //     await applyBooleanFilter(filters, 'isActive', filterConditions);

  //     // Validate and apply employee type filter
  //     if (filters.employeeType) {
  //       if (ALLOWED_EMPLOYEE_TYPES.includes(filters.employeeType)) {
  //         // Instead of filtering by employeeType in the employee document,
  //         // we'll need to find users with this employeeType and then filter employees
  //         const users = await this.userModel.find({
  //           employeeType: filters.employeeType,
  //           deleted: false
  //         }).select('_id').lean().exec();

  //         const userIds = users.map(user => user._id);
  //         filterConditions.push({ userId: { $in: userIds } });
  //       } else {
  //         throw new BadRequestException(
  //           `Invalid employeeType. Allowed values: ${ALLOWED_EMPLOYEE_TYPES.join(', ')}`,
  //         );
  //       }
  //     }

  //     // Apply clinic ID filter
  //     if (filters.clinicId) {
  //       filterConditions.push({ clinics: filters.clinicId });
  //     }

  //     // Apply clinic collection filter
  //     const clinicResult = await applyModelFilter(
  //       this.clinicCollectionModel,
  //       filters,
  //       'clinicCollectionName',
  //       'name',
  //       'clinicCollectionId',
  //       filterConditions,
  //       page,
  //       limit,
  //     );
  //     if (clinicResult) return clinicResult;

  //     // Apply department filter
  //     const departmentResult = await applyModelFilter(
  //       this.departmentModel,
  //       filters,
  //       'departmentName',
  //       'name',
  //       'departmentId',
  //       filterConditions,
  //       page,
  //       limit,
  //     );
  //     if (departmentResult) return departmentResult;

  //     // Apply flexible search
  //     if (filters.search) {
  //       const regex = new RegExp(filters.search, 'i');
  //       searchConditions.push(
  //         { name: regex },
  //         { identity: regex },
  //         { nationality: regex },
  //         { address: regex },
  //         { specialties: { $in: [regex] } },
  //         { Languages: { $in: [regex] } },
  //         { professional_experience: regex },
  //       );
  //     }

  //     // Remove processed fields
  //     const fieldsToDelete = [
  //       'search',
  //       'isActive',
  //       'employeeType',
  //       'clinicCollectionName',
  //       'departmentName',
  //     ];
  //     fieldsToDelete.forEach((field) => delete filters[field]);

  //     // Construct final filter
  //     const finalFilter = {
  //       ...(searchConditions.length > 0 && { $or: searchConditions }),
  //       ...(filterConditions.length > 0 && { $and: filterConditions }),
  //     };

  //     // Paginate and return results
  //     return paginate(
  //       this.employeeModel,
  //       [
  //         'companyId',
  //         { path: 'clinicCollectionId', select: 'name' },
  //         { path: 'departmentId', select: 'name' },
  //         'clinics',
  //         'specializations',
  //       ],
  //       page,
  //       limit,
  //       allData,
  //       finalFilter,
  //       sort,
  //     );
  //   } catch (error) {
  //     console.error('Error in getAllEmployees', error);
  //     throw new BadRequestException(
  //       error.message || 'Failed to retrieve employees',
  //     );
  //   }
  // }

  async getAllEmployees(paginationDto: PaginationAndFilterDto) {
    try {
      const {
        page,
        limit,
        allData,
        sortBy,
        order,
        search,
        fields,
        filter_fields,
      } = paginationDto;
      const query = {};
      const sortField: string = sortBy ?? 'id';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };
      if (search) {
        query['$or'] = [
          'name',
          'nationality',
          'address',
          'specialties',
          'Languages',
          'professional_experience',
        ].map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        }));
      }

      console.log('paginationDto', paginationDto);

      return paginate({
        model: this.employeeModel,
        populate: [
          // 'companyId',
          // { path: 'clinicCollectionId', select: 'name' },
          // { path: 'userId' },
          // 'clinics',
          // 'specializations',
          'roleIds',
        ],
        page: page,
        limit: limit,
        allData: allData,
        filter: filter_fields ? JSON.parse(filter_fields) : {},
        // sort: '',
        // sort: { [sortBy]: order === 'asc' ? 1 : -1 },
        search: search,
        searchFields: [
          'name',
          'nationality',
          'address',
          'Languages',
          'professional_experience',
        ],
        message: 'Request successful',
        sort: sort,
      });
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async getEmployeeById(id: string): Promise<ApiGetResponse<Employee>> {
    try {
      const employee = await this.employeeModel
        .findById(id)
        .populate([
          // 'companyId',
          // 'clinicCollectionId',
          // 'departmentId',
          'clinic',
          'specializations',
          'roleIds',
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
    userId: string,
  ): Promise<ApiGetResponse<Employee>> {
    try {
      console.log('userId', userId);
      console.log('updateEmployeeDto', updateEmployeeDto);
      let updatedEmployee = await this.employeeModel
        .findByIdAndUpdate(id, { deleted: false })
        .exec();

      if (!updatedEmployee || updatedEmployee.deleted)
        throw new NotFoundException('Employee not found or has been deleted');

      //Todo: check if the user has appointments

      if (id === userId && 'isActive' in updateEmployeeDto) {
        throw new BadRequestException(
          'You are not allowed to active/deactivate your own account',
        );
      }
      const restrictedFields = ['employeeType', 'email', 'password'];
      const isRestrictedFieldUpdated = restrictedFields.some(
        (field) => field in updateEmployeeDto,
      );
      if (isRestrictedFieldUpdated) {
        throw new BadRequestException(
          'You are not allowed to update this fields: ' +
            restrictedFields.join(', '),
        );
      }
      updatedEmployee.set(updateEmployeeDto);
      await updatedEmployee.save();
      return {
        success: true,
        message: 'The changes have been saved successfully',
        data: updatedEmployee,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async deleteEmployee(
    id: string,
    currentUserId: string,
  ): Promise<ApiGetResponse<Employee>> {
    try {
      const employee = await this.employeeModel.findById(id).exec();
      if (!employee || employee.deleted)
        throw new NotFoundException('Employee not found or has been deleted');
      if (currentUserId && currentUserId === id) {
        throw new BadRequestException('You cannot delete your own account');
      }

      if (employee.isActive)
        throw new BadRequestException(
          'This user cannot be deleted because they are currently active',
        );
      employee.deleted = true;
      employee.isActive = false;
      employee.name = employee.name + ' (Deleted)' + employee.publicId;
      // employee.identity = employee.identity + '(Deleted)' + employee.publicId;
      employee.email = `(Deleted)${employee.publicId}${employee.email}`;

      const deletedEmployee = await employee.save();

      return {
        success: true,
        message: 'User account deleted',
        data: deletedEmployee,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  // async getEmployeesWithoutUser(): Promise<ApiGetResponse<Employee[]>> {
  //   try {
  //     // First, get all user IDs that exist in the users collection
  //     const users = await this.userModel
  //       .find({ deleted: false })
  //       .select('_id')
  //       .lean()
  //       .exec();
  //     const userIds = users.map((user) => user._id.toString());

  //     // Build the query to find employees without a valid user
  //     const query = {
  //       $or: [
  //         { userId: { $exists: false } },
  //         { userId: null },
  //         { userId: '' },
  //         {
  //           $and: [
  //             { userId: { $exists: true } },
  //             { userId: { $ne: null } },
  //             { userId: { $ne: '' } },
  //             { userId: { $nin: userIds } },
  //           ],
  //         },
  //       ],
  //       deleted: false,
  //     };

  //     // Execute the query
  //     const employees = await this.employeeModel
  //       .find(query)
  //       .populate('userId', '_id email') // Populate userId for debugging
  //       .lean()
  //       .exec();

  //     return {
  //       success: true,
  //       message: 'Employees without user retrieved successfully',
  //       data: employees,
  //     };
  //   } catch (error) {
  //     console.error('Error in getEmployeesWithoutUser:', error);
  //     throw new BadRequestException(
  //       error.message || 'Failed to retrieve employees without user',
  //     );
  //   }
  // }

  async findByUserId(userId: string): Promise<EmployeeDocument | null> {
    return this.employeeModel
      .findOne({ userId: new Types.ObjectId(userId), deleted: false })
      .exec();
  }
  async getUserByIdentifier(identifier: string): Promise<EmployeeDocument> {
    const employee = await this.employeeModel
      .findOne({
        $or: [{ email: identifier }, { name: identifier }],
        deleted: false,
      })
      .select('+password') // Include password field which is normally excluded
      .exec();

    if (!employee) {
      throw new NotFoundException('User not found');
    }

    return employee;
  }

  async resetPassword(
    userId: string,
    currentUserId: string,
  ): Promise<ApiGetResponse<string>> {
    if (userId === currentUserId)
      throw new BadRequestException("you can't reset your onw password");
    const employee = await this.employeeModel
      .findOne({ _id: new Types.ObjectId(userId), deleted: false })
      .exec();
    if (!employee) {
      throw new NotFoundException('user not found');
    }
    const randomPassword = '12345678';
    //TODO send to email of employee the new password !?
    employee.password = await bcrypt.hash(randomPassword, 10);
    await employee.save();
    return {
      success: true,
      message:
        'password has been reset successfully. You can now log in with your new password.',
      data: '',
    };
  }
}
