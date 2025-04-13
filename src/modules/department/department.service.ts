import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
  ) {}

  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<ApiGetResponse<Department>> {
    const newDepartment = new this.departmentModel(createDepartmentDto);
    const savedDepartment = await newDepartment.save();
    return {
      success: true,
      message: 'Department created successfully',
      data: savedDepartment,
    };
  }

  async getAllDepartments(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
    return paginate(
      this.departmentModel,
      ['clinicCollectionId', 'specializations'],
      page,
      limit,
      allData,
      filters,
      sort,
    );
  }

  async getDepartmentById(id: string): Promise<ApiGetResponse<Department>> {
    const department = await this.departmentModel
      .findById(id)
      .populate(['clinicCollectionId', 'specializations']);
    if (!department) throw new NotFoundException('Department not found');
    return {
      success: true,
      message: 'department retrieved successfully',
      data: department,
    };
  }

  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<ApiGetResponse<Department>> {
    const updatedDepartment = await this.departmentModel
      .findByIdAndUpdate(id, updateDepartmentDto, { new: true })
      .populate(['clinicCollectionId']);
    if (!updatedDepartment) throw new NotFoundException('Department not found');
    return {
      success: true,
      message: 'Department update successfully',
      data: updatedDepartment,
    };
  }

  async deleteDepartment(id: string): Promise<ApiGetResponse<Department>> {
    const deletedDepartment = await this.departmentModel.findByIdAndDelete(id);
    if (!deletedDepartment) throw new NotFoundException('Department not found');
    return {
      success: true,
      message: 'Department remove successfully',
      data: {} as Department,
    };
  }

  async getCountByClinicCollectionId(
    clinicCollectionId: string,
  ): Promise<ApiGetResponse<{ count: number }>> {
    const count = await this.departmentModel
      .countDocuments({ clinicCollectionId })
      .exec();

    return {
      success: true,
      message: 'Department count retrieved successfully',
      data: { count },
    };
  }
}
