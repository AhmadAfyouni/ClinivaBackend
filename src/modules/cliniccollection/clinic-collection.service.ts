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

    const result = await paginate(
      this.clinicCollectionModel,
      ['companyId', 'specializations'],
      page,
      limit,
      allData,
      filters,
      sort,
    );

    // Add employee count for each clinic collection
    if (result.data) {
      const clinicCollections = result.data;
      const updatedClinicCollections = await Promise.all(clinicCollections.map(async (clinicCollection) => {
        const [employeeCount, departmentCount] = await Promise.all([
          this.employeeModel.countDocuments({
            clinicCollectionId: clinicCollection._id.toString()
          }),
          this.departmentModel.countDocuments({
            clinicCollectionId: clinicCollection._id.toString()
          })
        ]);

        // console.log(`Clinic ${clinicCollection.name} (${clinicCollection._id}):`)
        console.log(`- Employees: ${employeeCount}`)
        // console.log(`- Departments: ${departmentCount}`)

        // Create a new object with all the original properties plus counts
        return {
          ...clinicCollection.toObject(),
          employeeCount,
          departmentCount
        };
      }));

      // Update the result data with the new array containing employeeCount
      result.data = updatedClinicCollections;
    }

    return result;
  }

  async getClinicCollectionById(id: string): Promise<ApiGetResponse<ClinicCollection>> {
    const clinicCollection = await this.clinicCollectionModel
      .findById(id)
      .populate(['companyId', 'specializations'])
      .exec();
    if (!clinicCollection)
      throw new NotFoundException('Clinic Collection not found');
    return {
      success: true,
      message: 'clinic Collection retrieved successfully',
      data: clinicCollection,
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
