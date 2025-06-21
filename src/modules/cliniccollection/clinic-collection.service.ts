import {
  Injectable,
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { removeFileFromLocal } from 'src/common/utils/file.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Complex, ComplexDocument } from './schemas/cliniccollection.schema';
import { UpdateClinicCollectionDto } from './dto/update-clinic-collection.dto';
import { CreateClinicCollectionDto } from './dto/create-clinic-collection.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import {
  ApiGetResponse,
  ApiListResponse,
  paginate,
  SortType,
} from 'src/common/utils/paginate';
import {
  Employee,
  EmployeeDocument,
} from '../employee/schemas/employee.schema';
import {
  Department,
  DepartmentDocument,
} from '../department/schemas/department.schema';
import { DepartmentService } from '../department/department.service';
import { Clinic, ClinicDocument } from '../clinic/schemas/clinic.schema';
import {
  Appointment,
  AppointmentDocument,
} from '../appointment/schemas/appointment.schema';
import { generateUniquePublicId } from 'src/common/utils/id-generator';
import { saveFileLocally } from 'src/common/utils/upload.util';

@Injectable()
export class ClinicCollectionService {
  constructor(
    @InjectModel(Complex.name)
    private clinicCollectionModel: Model<ComplexDocument>,
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    @InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    private readonly departmentService: DepartmentService,
  ) {}

  private async checkUniqueName(name: string, company) {
    const existingClinicCollection = await this.clinicCollectionModel
      .findOne({
        tradeName: name,
        companyId: company,
      })
      .exec();
    if (existingClinicCollection) {
      throw new BadRequestException(
        'A Complex with this name(' +
          name +
          ') already exists in the specified company.',
      );
    }
  }

  async createClinicCollection(
    createClinicCollectionDto: CreateClinicCollectionDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<ApiGetResponse<Complex>> {
    try {
      const employee = await this.employeeModel.findById(userId);
      if (employee?.plan === 'company') {
        if (employee && employee.companyId) {
          createClinicCollectionDto.companyId = employee.companyId;

          await this.checkUniqueName(
            createClinicCollectionDto.tradeName,
            createClinicCollectionDto.companyId,
          );
        } else {
          throw new BadRequestException(
            'Company ID is required for company plan',
          );
        }
      } else if (employee?.plan === 'complex') {
        if (!employee?.Owner) {
          throw new BadRequestException('Employee is not Owner');
        }
      } else {
        throw new BadRequestException(
          'there is an error while creating the Complex Employee is not Owner or Plan is wrong',
        );
      }
      const publicId = await generateUniquePublicId(
        this.clinicCollectionModel,
        'cmx',
      );
      let relativeFilePath = '';
      if (file) {
        relativeFilePath = file
          ? saveFileLocally(file, 'complex/' + publicId + '/images')
          : '';
        createClinicCollectionDto.logo = relativeFilePath;
      }
      const newClinicCollection = new this.clinicCollectionModel({
        ...createClinicCollectionDto,
        publicId,
        plan: employee?.plan,
      });
      if (!createClinicCollectionDto.department_name) {
        throw new BadRequestException('Department name is required');
      }

      const savedClinicCollection = await newClinicCollection.save();
      const department = await this.departmentService.createDepartment(
        {
          clinicCollectionId: savedClinicCollection.id,
          name: createClinicCollectionDto.department_name,
          description: createClinicCollectionDto.department_description || '',
        },
        userId,
      );
      console.log(savedClinicCollection);
      console.log(department);
      return {
        success: true,
        message: 'Medical complex Added successfully',
        data: savedClinicCollection,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(
        'Failed to add Medical complex',
        error.message,
      );
    }
  }

  async getAllClinicCollections(paginationDto: PaginationAndFilterDto) {
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
        query['$or'] = ['legalName'].map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        }));
      }

      return paginate({
        model: this.clinicCollectionModel,
        populate: ['companyId', 'PIC'],
        page: page,
        limit: limit,
        allData: allData,
        filter: filter_fields ? JSON.parse(filter_fields) : {},
        search: search,
        searchFields: ['legalName', 'tradeName', 'policies', 'publicId'],
        message: 'Request successful',
        sort: sort,
      });
    } catch (error) {
      console.log(error.message);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(
        'Failed to retrieve Medical Complexes',
        error.message,
      );
    }
  }

  private async getRelatedCount(
    id: string,
    model: Model<any>,
    foreignKey: string,
  ): Promise<number> {
    return await model.countDocuments({
      [foreignKey]: id,
    });
  }

  private async getClinicCounts(clinicCollection: ComplexDocument) {
    const countConfigs = [
      {
        model: this.employeeModel,
        foreignKey: 'clinicCollectionId',
        resultKey: 'employeeCount',
      },
      {
        model: this.departmentModel,
        foreignKey: 'clinicCollectionId',
        resultKey: 'departmentCount',
      },
      // Add more models here as needed, for example:
      // { model: this.clinicModel, foreignKey: 'clinicCollectionId', resultKey: 'clinicCount' }
    ];

    const counts = await Promise.all(
      countConfigs.map(async (config) => {
        const count = await this.getRelatedCount(
          clinicCollection._id.toString(),
          config.model,
          config.foreignKey,
        );
        // console.log(`- ${config.resultKey}: ${count}`);
        return { [config.resultKey]: count };
      }),
    );

    return {
      ...clinicCollection.toObject(),
      ...Object.assign({}, ...counts),
    };
  }

  async getClinicCollectionById(id: string): Promise<ApiGetResponse<Complex>> {
    try {
      const collection = await this.clinicCollectionModel
        .findById(id)
        .populate(['companyId', 'PIC'])
        .exec();
      if (!collection || collection.deleted)
        throw new NotFoundException(
          'Medical Complex not found or has been deleted',
        );

      const base = await this.getClinicCounts(collection);

      const departments = await this.departmentModel
        .find({ clinicCollectionId: id })
        .exec();
      const clinics = await this.clinicModel
        .find({ departmentId: { $in: departments.map((d) => d._id) } })
        .exec();
      const uniquePatients = await this.appointmentModel.distinct('patient', {
        clinic: { $in: clinics.map((c) => c._id) },
      });
      const doctors = await this.employeeModel
        .find({
          clinics: { $in: clinics.map((c) => c._id) },
          employeeType: 'Doctor',
        })
        .exec();
      const staff = await this.employeeModel
        .find({
          clinics: { $in: clinics.map((c) => c._id) },
        })
        .exec();

      return {
        success: true,
        message: 'Medical Complex retrieved successfully',
        data: {
          ...base,
          departments: departments,
          clinicsCount: clinics.length,
          patientsCount: uniquePatients.length,
          doctorsCount: doctors.length,
          staffCount: staff.length,
          assignedDepartments: departments,
          assignedClinics: clinics,
          assignedDoctors: doctors,
          assignedStaff: staff,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to retrieve Medical Complex');
    }
  }

  async updateClinicCollection(
    id: string,
    updateClinicCollectionDto: UpdateClinicCollectionDto,
    file?: Express.Multer.File,
  ): Promise<ApiGetResponse<Complex>> {
    try {
      const denyFields = ['companyId', 'publicId', 'tradeName'];
      if (
        Object.keys(updateClinicCollectionDto).some((key) =>
          denyFields.some((denyField) => denyField === key),
        )
      ) {
        throw new BadRequestException(
          'You are not allowed to update this fields:[ ' +
            denyFields.join(', ') +
            ']',
        );
      }
      if (file) {
        // removeFileFromLocal(updateClinicCollectionDto.logo ?? '');

        updateClinicCollectionDto.logo = saveFileLocally(
          file,
          'complex/' + updateClinicCollectionDto.publicId + '/images',
        );
      }
      const updatedClinicCollection = await this.clinicCollectionModel
        .findByIdAndUpdate(id, updateClinicCollectionDto, {
          new: true,
          runValidators: true,
          strict: 'throw',
          strictQuery: 'throw',
        })
        .populate(['companyId']);
      if (!updatedClinicCollection || updatedClinicCollection.deleted)
        throw new NotFoundException(
          'Medical Complex not found or has been deleted',
        );

      return {
        success: true,
        message: 'Medical Complex details updated successfully',
        data: updatedClinicCollection,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(
        'Failed to update Medical Complex:' + error.message,
      );
    }
  }

  async deleteClinicCollection(id: string): Promise<ApiGetResponse<Complex>> {
    try {
      const clinicCollection = await this.clinicCollectionModel
        .findById(id)
        .exec();
      if (!clinicCollection || clinicCollection.deleted)
        throw new NotFoundException(
          'Medical Complex not found or has been deleted',
        );

      clinicCollection.deleted = true;
      clinicCollection.tradeName =
        clinicCollection.tradeName + ' (Deleted)' + clinicCollection.publicId;
      clinicCollection.legalName =
        clinicCollection.legalName + ' (Deleted)' + clinicCollection.publicId;
      removeFileFromLocal(clinicCollection.logo);
      const deletedClinicCollection = await clinicCollection.save();

      return {
        success: true,
        message: 'Medical Complex marked as deleted successfully',
        data: deletedClinicCollection,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException('Failed to delete Medical Complex');
    }
  }
}
