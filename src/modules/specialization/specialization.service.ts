import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Specialization, SpecializationDocument } from './schemas/specialization.schema';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';
import { ApiResponse, paginate } from 'src/common/utlis/paginate';

@Injectable()
export class SpecializationService {
  constructor(@InjectModel(Specialization.name) private specializationModel: Model<SpecializationDocument>) {}

  async createSpecialization(createSpecializationDto: CreateSpecializationDto): Promise<ApiResponse<Specialization>> {
    const newSpecialization = new this.specializationModel(createSpecializationDto);
    const savedSpecialization = await newSpecialization.save();
    return {
      success: true,
      message: 'Specialization created successfully',
      data: savedSpecialization,
    };
  }

  async getAllSpecializations(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
    return paginate(this.specializationModel, [], page, limit, allData, filters, sort);
  }

  async getSpecializationById(id: string): Promise<ApiResponse<Specialization>> {
    const specialization = await this.specializationModel.findById(id).exec();
    if (!specialization) throw new NotFoundException('Specialization not found');
    return {
      success: true,
      message: 'Specialization retrieved successfully',
      data: specialization,
    };
  }

  async updateSpecialization(id: string, updateSpecializationDto: UpdateSpecializationDto): Promise<ApiResponse<Specialization>> {
    const updatedSpecialization = await this.specializationModel.findByIdAndUpdate(id, updateSpecializationDto, { new: true }).exec();
    if (!updatedSpecialization) throw new NotFoundException('Specialization not found');

    return {
      success: true,
      message: 'Specialization updated successfully',
      data: updatedSpecialization,
    };
  }

  async deleteSpecialization(id: string): Promise<ApiResponse<Specialization>> {
    const deletedSpecialization = await this.specializationModel.findByIdAndDelete(id).exec();
    if (!deletedSpecialization) throw new NotFoundException('Specialization not found');
    return {
      success: true,
      message: 'Specialization removed successfully',
    };
  }
}
