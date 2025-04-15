import { Injectable, NotFoundException } from '@nestjs/common';
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
import { Employee, EmployeeDocument } from '../employee/schemas/employee.schema';
import { Department, DepartmentDocument } from '../department/schemas/department.schema';

@Injectable()
export class ClinicCollectionService {
  constructor(
    @InjectModel(ClinicCollection.name)
    private clinicCollectionModel: Model<ClinicCollectionDocument>,
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
  ) {}

  async createClinicCollection(
    createClinicCollectionDto: CreateClinicCollectionDto,
  ): Promise<ApiGetResponse<ClinicCollection>> {
    const newClinicCollection = new this.clinicCollectionModel(
      createClinicCollectionDto,
    );
    const savedClinicCollection = await newClinicCollection.save();
    return {
      success: true,
      message: 'clinic Collection created successfully',
      data: savedClinicCollection,
    };
  }

  async getAllClinicCollections(
    paginationDto: PaginationAndFilterDto,
    filters: any,
  ) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
     
    const searchConditions: any[] = [];

    if (filters.search) {
      const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الحروف
  
      searchConditions.push(
        { name: regex },
        { overview: regex },
        { address: regex },
        { vision: regex },
        { goals: regex },
        { policies: regex },
        { details: regex } 
      );
  
     
      searchConditions.push(
        { specializations: { $in: [regex] } },
        { contactInfos: { $elemMatch: { value: regex } } },
        { insuranceCompany: { $elemMatch: { name: regex } } }
      );
    }
  
    
    delete filters.search;
  
    
    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
    };

    const result = await paginate(
      this.clinicCollectionModel,
      ['companyId', 'specializations'],
      page,
      limit,
      allData,
      finalFilter,
      sort,
    );

    if (result.data) {
      const clinicCollections = result.data;
      const updatedClinicCollections = await Promise.all(
        clinicCollections.map((clinicCollection) => this.addClinicCounts(clinicCollection))
      );
      result.data = updatedClinicCollections;
    }

    return result;
  }

  private async getRelatedCount(id: string, model: Model<any>, foreignKey: string): Promise<number> {
    return await model.countDocuments({
      [foreignKey]: id
    });
  }

  private async addClinicCounts(clinicCollection: ClinicCollectionDocument) {
    const countConfigs = [
      { model: this.employeeModel, foreignKey: 'clinicCollectionId', resultKey: 'employeeCount' },
      { model: this.departmentModel, foreignKey: 'clinicCollectionId', resultKey: 'departmentCount' }
      // Add more models here as needed, for example:
      // { model: this.clinicModel, foreignKey: 'clinicCollectionId', resultKey: 'clinicCount' }
    ];

    const counts = await Promise.all(
      countConfigs.map(async config => {
        const count = await this.getRelatedCount(
          clinicCollection._id.toString(),
          config.model,
          config.foreignKey
        );
        console.log(`- ${config.resultKey}: ${count}`);
        return { [config.resultKey]: count };
      })
    );

    return {
      ...clinicCollection.toObject(),
      ...Object.assign({}, ...counts)
    };
  }

  async getClinicCollectionById(id: string): Promise<ApiGetResponse<ClinicCollection>> {
    const clinicCollection = await this.clinicCollectionModel
      .findById(id)
      .populate(['companyId', 'specializations'])
      .exec();

    if (!clinicCollection)
      throw new NotFoundException('Clinic Collection not found');

    const clinicCollectionWithCounts = await this.addClinicCounts(clinicCollection);

    return {
      success: true,
      message: 'clinic Collection retrieved successfully',
      data: clinicCollectionWithCounts,
    };
  }

  async updateClinicCollection(
    id: string,
    updateClinicCollectionDto: UpdateClinicCollectionDto,
  ): Promise<ApiGetResponse<ClinicCollection>> {
    const updatedClinicCollection = await this.clinicCollectionModel
      .findByIdAndUpdate(id, updateClinicCollectionDto, { new: true })
      .populate(['companyId']);
    if (!updatedClinicCollection)
      throw new NotFoundException('Clinic Collection not found');

    return {
      success: true,
      message: 'Clinic Collection update successfully',
      data: updatedClinicCollection,
    };
  }

  async deleteClinicCollection(
    id: string,
  ): Promise<ApiGetResponse<ClinicCollection>> {
    const deletedClinicCollection =
      await this.clinicCollectionModel.findByIdAndDelete(id);
    if (!deletedClinicCollection)
      throw new NotFoundException('Clinic Collection not found');
    return {
      success: true,
      message: 'Clinic Collection remove successfully',
      data: {} as ClinicCollection,
    };
  }
}
