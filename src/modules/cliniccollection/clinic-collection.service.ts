import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ClinicCollection,
  ClinicCollectionDocument,
} from './schemas/cliniccollection.schema';
import { UpdateClinicCollectionDto } from './dto/update-clinic-collection.dto';
import { CreateClinicCollectionDto } from './dto/create-clinic-collection.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import {
  Employee,
  EmployeeDocument,
} from '../employee/schemas/employee.schema';
import {
  Department,
  DepartmentDocument,
} from '../department/schemas/department.schema';
import { Clinic, ClinicDocument } from '../clinic/schemas/clinic.schema';
import {
  Appointment,
  AppointmentDocument,
} from '../appointment/schemas/appointment.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
import { Company } from '../company/schemas/company.schema';

@Injectable()
export class ClinicCollectionService {
  constructor(
    @InjectModel(ClinicCollection.name)
    private clinicCollectionModel: Model<ClinicCollectionDocument>,
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    @InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}
  private async checkUniqueName(name: string, companyId: string) {
    const existingClinicCollection = await this.clinicCollectionModel.findOne({
      name,
      companyId,
    });

    if (existingClinicCollection) {
      throw new BadRequestException(
        'A clinic collection with this name already exists in the specified company.',
      );
    }
  }
  async createClinicCollection(
    createClinicCollectionDto: CreateClinicCollectionDto,
    plan: string,
    companyId: Company,
  ): Promise<ApiGetResponse<ClinicCollection>> {
    try {
      console.log('createClinicCollectionDtpppppppppp', plan);
      if (plan === 'company' && companyId) {
        createClinicCollectionDto.companyId = companyId._id;
      } else {
        throw new BadRequestException(
          'Company ID is required for company plan',
        );
      }
      if (createClinicCollectionDto.companyId) {
        await this.checkUniqueName(
          createClinicCollectionDto.name,
          createClinicCollectionDto.companyId.toString(),
        );
      }
      console.log('createClinicCollection');
      const publicId = await generateUniquePublicId(
        this.clinicCollectionModel,
        'com',
      );
      console.log('publicId', publicId);
      const newClinicCollection = new this.clinicCollectionModel({
        ...createClinicCollectionDto,
        publicId,
        plan,
      });
      console.log('newClinicCollection', newClinicCollection);
      const savedClinicCollection = await newClinicCollection.save();
      return {
        success: true,
        message: 'clinic Collection created successfully',
        data: savedClinicCollection,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(
        'Failed to create clinic collection',
        error.message,
      );
    }
  }

  async getAllClinicCollections(
    paginationDto: PaginationAndFilterDto,
    filters: any,
  ) {
    console.log('getAllClinicCollections');
    let { page, limit, allData, sortBy, order } = paginationDto;
    console.log(paginationDto.order);
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    order = order || 'asc';
    console.log(order);
    const sortField: string = sortBy ?? 'id';
    const sort: { [key: string]: 1 | -1 } = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
    console.log(sortField);

    const searchConditions: any[] = [];

    if (filters.search) {
      const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الحروف

      searchConditions.push(
        { name: regex },

        { address: regex },
      );
    }

    delete filters.search;

    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
    };
    finalFilter.deleted = { $ne: true };

    const result = await paginate(
      this.clinicCollectionModel,
      ['companyId', 'specializations', 'PIC'],
      page,
      limit,
      allData,
      finalFilter,
      sort,
    );

    if (result.data) {
      const clinicCollections = result.data;
      const updatedClinicCollections = await Promise.all(
        clinicCollections.map((clinicCollection) =>
          this.addClinicCounts(clinicCollection),
        ),
      );
      result.data = updatedClinicCollections;
    }

    return result;
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

  private async addClinicCounts(clinicCollection: ClinicCollectionDocument) {
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

  async getClinicCollectionById(
    id: string,
  ): Promise<ApiGetResponse<ClinicCollection>> {
    try {
      const collection = await this.clinicCollectionModel
        .findById(id)
        .populate(['companyId', 'specializations'])
        .exec();
      if (!collection || collection.deleted)
        throw new NotFoundException(
          'Clinic Collection not found or has been deleted',
        );

      const base = await this.addClinicCounts(collection);

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
        message: 'Clinic Collection retrieved successfully',
        data: {
          ...base,
          clinicsCount: clinics.length,
          patientsCount: uniquePatients.length,
          doctorsCount: doctors.length,
          staffCount: staff.length,
          assignedDepartments: departments,
          assignedClinics: clinics,
          assignedSpecializations: collection.specializations,
          assignedDoctors: doctors,
          assignedStaff: staff,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to retrieve clinic collection',
      );
    }
  }

  async updateClinicCollection(
    id: string,
    updateClinicCollectionDto: UpdateClinicCollectionDto,
  ): Promise<ApiGetResponse<ClinicCollection>> {
    const updatedClinicCollection = await this.clinicCollectionModel
      .findByIdAndUpdate(id, updateClinicCollectionDto, { new: true })
      .populate(['companyId']);
    if (!updatedClinicCollection || updatedClinicCollection.deleted)
      throw new NotFoundException(
        'Clinic Collection not found or has been deleted',
      );

    return {
      success: true,
      message: 'Clinic Collection update successfully',
      data: updatedClinicCollection,
    };
  }

  async deleteClinicCollection(
    id: string,
  ): Promise<ApiGetResponse<ClinicCollection>> {
    const clinicCollection = await this.clinicCollectionModel
      .findById(id)
      .exec();
    if (!clinicCollection || clinicCollection.deleted)
      throw new NotFoundException(
        'Clinic Collection not found or has been deleted',
      );

    clinicCollection.deleted = true;
    clinicCollection.name =
      clinicCollection.name + ' (Deleted)' + clinicCollection.publicId;
    const deletedClinicCollection = await clinicCollection.save();

    return {
      success: true,
      message: 'Clinic Collection marked as deleted successfully',
      data: deletedClinicCollection,
    };
  }
}
