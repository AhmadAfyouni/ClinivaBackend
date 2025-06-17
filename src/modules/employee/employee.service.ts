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
import { WorkingHoursBase } from 'src/common/utils/helper.dto';
import { validateEmployeeWorkingHours } from 'src/common/utils/time-utils';
import { Clinic, ClinicDocument } from '../clinic/schemas/clinic.schema';
import { EmailService } from './dto/email.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Complex.name)
    private clinicCollectionModel: Model<ComplexDocument>,
    @InjectModel(Clinic.name)
    private clinicModel: Model<ClinicDocument>,
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    private readonly emailService: EmailService,
    // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async validateEmployeeWorkingHours(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<void> {
    interface WorkingHoursDay {
      day: string;
      shift1?: { startTime: string; endTime: string };
      shift2?: { startTime: string; endTime: string };
    }
    try {
      if (
        !createEmployeeDto.workingHours ||
        createEmployeeDto.workingHours.length === 0
      ) {
        return; // No working hours to validate
      }

      // Check if employee is assigned to a clinic
      if (createEmployeeDto.clinicId) {
        // Get the first clinic (assuming one clinic per employee for simplicity)
        const clinic = await this.clinicModel
          .findById(createEmployeeDto.clinicId)
          .select('WorkingHours departmentId name')
          .lean()
          .exec();

        if (clinic) {
          const clinicWorkingHours = (clinic as any).WorkingHours;

          if (clinicWorkingHours && clinicWorkingHours.length > 0) {
            // Validate against clinic working hours
            try {
              validateEmployeeWorkingHours(
                createEmployeeDto.workingHours as any,
                clinicWorkingHours,
                'clinic',
              );
              return; // Validation successful
            } catch (error) {
              // Enhance error message with clinic name and working hours
              const clinicName = (clinic as any).name || 'the clinic';
              const dayMatch = (error as Error).message.match(/on (\w+)/);
              const day = dayMatch ? dayMatch[1] : 'the specified day';
              const clinicDay = clinicWorkingHours.find(
                (wh: WorkingHoursDay) =>
                  wh.day.toLowerCase() === day.toLowerCase(),
              ) as WorkingHoursDay | undefined;

              if (clinicDay) {
                const shifts: string[] = [];
                if (clinicDay.shift1?.startTime && clinicDay.shift1?.endTime) {
                  shifts.push(
                    `Shift 1: ${clinicDay.shift1.startTime} - ${clinicDay.shift1.endTime}`,
                  );
                }
                if (clinicDay.shift2?.startTime && clinicDay.shift2?.endTime) {
                  shifts.push(
                    `Shift 2: ${clinicDay.shift2.startTime} - ${clinicDay.shift2.endTime}`,
                  );
                }

                throw new Error(
                  `${error.message}. ` +
                    `The clinic "${clinicName}" is only open ${shifts.join(' and ')} on ${day}. ` +
                    'Please adjust the working hours accordingly.',
                );
              }
              throw error;
            }
          }

          // If clinic doesn't have working hours, check the complex
          if (clinic.departmentId) {
            const department = await this.departmentModel
              .findById(clinic.departmentId)
              .select('clinicCollectionId')
              .lean()
              .exec();

            if (department?.clinicCollectionId) {
              const complex = await this.clinicCollectionModel
                .findById(department.clinicCollectionId)
                .select('generalInfo name')
                .lean()
                .exec();

              const complexWorkingHours = (complex?.generalInfo as any)
                ?.workingHours;
              if (complexWorkingHours?.length > 0) {
                try {
                  validateEmployeeWorkingHours(
                    createEmployeeDto.workingHours as any,
                    complexWorkingHours,
                    'complex',
                  );
                  return; // Validation successful
                } catch (error) {
                  // Enhance error message with complex name and working hours
                  const complexName = (complex as any)?.name || 'the complex';
                  const dayMatch = (error as Error).message.match(/on (\w+)/);
                  const day = dayMatch ? dayMatch[1] : 'the specified day';
                  const complexDay = complexWorkingHours.find(
                    (wh: WorkingHoursDay) =>
                      wh.day.toLowerCase() === day.toLowerCase(),
                  ) as WorkingHoursDay | undefined;

                  if (complexDay) {
                    const shifts: string[] = [];
                    if (
                      complexDay.shift1?.startTime &&
                      complexDay.shift1?.endTime
                    ) {
                      shifts.push(
                        `Shift 1: ${complexDay.shift1.startTime} - ${complexDay.shift1.endTime}`,
                      );
                    }
                    if (
                      complexDay.shift2?.startTime &&
                      complexDay.shift2?.endTime
                    ) {
                      shifts.push(
                        `Shift 2: ${complexDay.shift2.startTime} - ${complexDay.shift2.endTime}`,
                      );
                    }

                    throw new Error(
                      `${error.message}. ` +
                        `The complex "${complexName}" is only open ${shifts.join(' and ')} on ${day}. ` +
                        'Please adjust the working hours accordingly.',
                    );
                  }
                  throw error;
                }
              }
            }
          }
        }
      }

      // If employee is directly assigned to a complex
      if (createEmployeeDto.complexId) {
        const complex = await this.clinicCollectionModel
          .findById(createEmployeeDto.complexId)
          .select('generalInfo name')
          .lean()
          .exec();

        const complexWorkingHours = (complex?.generalInfo as any)?.workingHours;
        if (complexWorkingHours?.length > 0) {
          try {
            validateEmployeeWorkingHours(
              createEmployeeDto.workingHours as any,
              complexWorkingHours,
              'complex',
            );
            return; // Validation successful
          } catch (error) {
            // Enhance error message with complex name and working hours
            const complexName = (complex as any)?.name || 'the complex';
            const dayMatch = (error as Error).message.match(/on (\w+)/);
            const day = dayMatch ? dayMatch[1] : 'the specified day';
            const complexDay = complexWorkingHours.find(
              (wh: WorkingHoursDay) =>
                wh.day.toLowerCase() === day.toLowerCase(),
            ) as WorkingHoursDay | undefined;

            if (complexDay) {
              const shifts: string[] = [];
              if (complexDay.shift1?.startTime && complexDay.shift1?.endTime) {
                shifts.push(
                  `Shift 1: ${complexDay.shift1.startTime} - ${complexDay.shift1.endTime}`,
                );
              }
              if (complexDay.shift2?.startTime && complexDay.shift2?.endTime) {
                shifts.push(
                  `Shift 2: ${complexDay.shift2.startTime} - ${complexDay.shift2.endTime}`,
                );
              }

              throw new Error(
                `${error.message}. ` +
                  `The complex "${complexName}" is only open ${shifts.join(' and ')} on ${day}. ` +
                  'Please adjust the working hours accordingly.',
              );
            }
            throw error;
          }
        }
      }

      // If we reach here, no validation was performed (no parent entity or no working hours defined)
      // This is acceptable as working hours are optional at the parent level
    } catch (error) {
      throw new BadRequestException(`Invalid working hours: ${error.message}`);
    }
  }

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
    file?: Express.Multer.File,
    workPermit?: Express.Multer.File,
    CV?: Express.Multer.File,
    certifications?: Express.Multer.File,
    employmentContract?: Express.Multer.File,
  ): Promise<ApiGetResponse<Employee>> {
    try {
      if (
        createEmployeeDto.workingHours &&
        createEmployeeDto.workingHours.length > 0
      ) {
        await this.validateEmployeeWorkingHours(createEmployeeDto);
      }
      const requiredFields = ['name', 'password', 'email', 'employeeType'];
      const missingFields = requiredFields.filter(
        (field) => !createEmployeeDto[field],
      );

      if (missingFields.length > 0) {
        throw new BadRequestException(
          `Missing required fields: ${missingFields.join(', ')}`,
        );
      }
      if (typeof createEmployeeDto.contactInfos === 'string') {
        createEmployeeDto.contactInfos = JSON.parse(
          createEmployeeDto.contactInfos,
        );
      }
      if (typeof createEmployeeDto.workingHours === 'string') {
        createEmployeeDto.workingHours = JSON.parse(
          createEmployeeDto.workingHours,
        );
      }
      const publicId = await generateUniquePublicId(this.employeeModel, 'emp');
      const relativeFilePath = file
        ? saveFileLocally(file, 'employees/' + publicId + '/images')
        : '';
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createEmployeeDto.password,
        saltRounds,
      );
      const CVSize = CV ? CV.size / 1024 : 0;
      const workPermitSize = workPermit ? workPermit.size / 1024 : 0;
      const employmentContractSize = employmentContract
        ? employmentContract.size / 1024
        : 0;
      const certificationsSize = certifications
        ? certifications.size / 1024
        : 0;
      const newEmployee = new this.employeeModel({
        ...createEmployeeDto,
        publicId,
        password: hashedPassword,
        image: relativeFilePath || '',
        workPermit: workPermit
          ? saveFileLocally(
              workPermit,
              'employees/' + publicId + '/workPermits',
            )
          : '',
        CV: CV ? saveFileLocally(CV, 'employees/' + publicId + '/CVs') : '',
        certifications: certifications
          ? saveFileLocally(
              certifications,
              'employees/' + publicId + '/certifications',
            )
          : '',
        employmentContract: employmentContract
          ? saveFileLocally(
              employmentContract,
              'employees/' + publicId + '/employmentContracts',
            )
          : '',
        CVSize,
        workPermitSize,
        employmentContractSize,
        certificationsSize,
      });
      if (createEmployeeDto.email) {
        console.log(createEmployeeDto.email);
        this.emailService.validateEmailOrThrow(createEmployeeDto.email);
        await this.emailService.sendEmail(
          // Add await here
          createEmployeeDto.email,
          'Welcome to Cliniva',
          'Thank you for signing up to Cliniva!',
        );
      }

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
        ? saveFileLocally(file, 'employees/' + publicId + '/images')
        : '';
      const employeeType =
        'employeeType' in createEmployeeDto
          ? createEmployeeDto.employeeType
          : 'Staff Member';
      let role;
      if (employeeType === 'Admin') {
        role = await this.roleModel.findOne({ name: 'Admin' });
        if (!role) throw new InternalServerErrorException('No Roles Found');
        createEmployeeDto.identity = '(Admin)-' + publicId;
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
          'roleIds',
          {
            path: 'workingHours',
            populate: [
              {
                path: 'shift1',
                // model: 'shift',
              },
              {
                path: 'shift2',
                // model: 'shift',
              },
            ],
          },
        ],
        page: page,
        limit: limit,
        allData: allData,
        filter: filter_fields ? JSON.parse(filter_fields) : {},
        search: search,
        searchFields: [
          'name',
          'nationality',
          'address',
          'identity',
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
          // {
          //   path: 'workingHours',
          //   populate: {
          //     path: 'shift1',
          //     model: 'Shift',
          //   },
          // },
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
    files: {
      image?: Express.Multer.File[];
      workPermit?: Express.Multer.File[];
      CV?: Express.Multer.File[];
      certifications?: Express.Multer.File[];
      employmentContract?: Express.Multer.File[];
    },
    userId: string,
  ): Promise<ApiGetResponse<Employee>> {
    // If working hours are being updated, validate them
    if (updateEmployeeDto.workingHours) {
      // Create a temporary DTO with the update data
      const tempDto = new CreateEmployeeDto();
      Object.assign(tempDto, updateEmployeeDto);

      // If clinics or clinicCollectionId are not being updated, get them from the existing employee
      if (!tempDto.clinicIds?.length && !tempDto.complexId) {
        const existingEmployee = await this.employeeModel
          .findById(id)
          .lean()
          .exec();
        if (existingEmployee) {
          tempDto.clinicIds = (existingEmployee as any).clinics || [];
          tempDto.complexId = (existingEmployee as any).complexId;
        }
      }

      await this.validateEmployeeWorkingHours(tempDto);
    }
    try {
      let InstanceEmployee = await this.employeeModel
        .findByIdAndUpdate(id, { deleted: false })
        .exec();

      if (!InstanceEmployee || InstanceEmployee.deleted)
        throw new NotFoundException('Employee not found or has been deleted');
      if (
        'contactInfos' in updateEmployeeDto &&
        typeof updateEmployeeDto.contactInfos === 'string'
      ) {
        updateEmployeeDto.contactInfos = JSON.parse(
          updateEmployeeDto.contactInfos,
        );
      }
      let employmentContractSize = 0;
      let certificationsSize = 0;
      let CVSize = 0;
      let workPermitSize = 0;
      let relativeFilePath = '';
      if (files) {
        if (files.image) {
          CVSize = files.CV ? files.CV[0].size / 1024 : 0;
          workPermitSize = files.workPermit
            ? files.workPermit[0].size / 1024
            : 0;
          employmentContractSize = files.employmentContract
            ? files.employmentContract[0].size / 1024
            : 0;
          certificationsSize = files.certifications
            ? files.certifications[0].size / 1024
            : 0;
          relativeFilePath = files.image
            ? saveFileLocally(
                files.image[0],
                'employees/' + InstanceEmployee.publicId + '/images',
              )
            : '';
          InstanceEmployee.image = relativeFilePath;
        }
        if (files.workPermit) {
          const relativeFilePath = files.workPermit
            ? saveFileLocally(
                files.workPermit[0],
                'employees/' + InstanceEmployee.publicId + '/workPermits',
              )
            : '';
          InstanceEmployee.workPermit = relativeFilePath;
        }
        if (files.CV) {
          const relativeFilePath = files.CV
            ? saveFileLocally(
                files.CV[0],
                'employees/' + InstanceEmployee.publicId + '/CVs',
              )
            : '';
          InstanceEmployee.CV = relativeFilePath;
        }
        if (files.certifications) {
          const relativeFilePath = files.certifications
            ? saveFileLocally(
                files.certifications[0],
                'employees/' + InstanceEmployee.publicId + '/certifications',
              )
            : '';
          InstanceEmployee.certifications = relativeFilePath;
        }
        if (files.employmentContract) {
          const relativeFilePath = files.employmentContract
            ? saveFileLocally(
                files.employmentContract[0],
                'employees/' +
                  InstanceEmployee.publicId +
                  '/employmentContracts',
              )
            : '';
          InstanceEmployee.employmentContract = relativeFilePath;
        }
      }
      if (
        'workingHours' in updateEmployeeDto &&
        typeof updateEmployeeDto.workingHours === 'string'
      ) {
        updateEmployeeDto.workingHours = JSON.parse(
          updateEmployeeDto.workingHours,
        );
      }
      //Todo: check if the user has appointments

      if (id === userId && 'isActive' in updateEmployeeDto) {
        throw new BadRequestException(
          'You are not allowed to active/deactivate your own account',
        );
      }
      const restrictedFields = [
        'employeeType',
        'email',
        'password',
        'identity',
      ];
      const isRestrictedFieldUpdated = restrictedFields.some(
        (field) => field in updateEmployeeDto,
      );
      if (isRestrictedFieldUpdated) {
        throw new BadRequestException(
          'You are not allowed to update this fields: ' +
            restrictedFields.join(', '),
        );
      }

      InstanceEmployee.set(updateEmployeeDto);
      InstanceEmployee.set('certificationsSize', certificationsSize);
      InstanceEmployee.set('CVSize', CVSize);
      InstanceEmployee.set('employmentContractSize', employmentContractSize);
      InstanceEmployee.set('workPermitSize', workPermitSize);
      await InstanceEmployee.save();
      return {
        success: true,
        message: 'The changes have been saved successfully',
        data: InstanceEmployee,
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
      employee.identity = employee.identity + '(Deleted)' + employee.publicId;
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
    const randomPassword = await generateUniquePublicId(
      this.employeeModel,
      employee.name,
      'new',
    );
    this.emailService.sendEmail(
      employee.email,
      'reset cliniva password account',
      'Your password is: ' + randomPassword,
      'Your password is <strong><u>' + randomPassword + '</u></strong>',
    );
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
