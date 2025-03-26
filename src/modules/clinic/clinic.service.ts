import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clinic, ClinicDocument } from './schemas/clinic.schema';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ApiResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class ClinicService {
  constructor(@InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>) {
  }

  async createClinic(createClinicDto: CreateClinicDto): Promise<ApiResponse<Clinic>> {
    const newClinic = new this.clinicModel(createClinicDto);
    const savedClinic = await newClinic.save();
    return {
      success: true,
      message: 'Clinic created successfully',
      data: savedClinic,
    };
  }


  async getAllClinics(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
    return paginate(this.clinicModel, ['departmentId'], page, limit, allData, filters, sort);
  }

  async getClinicById(id: string): Promise<ApiResponse<Clinic>> {
    const clinic = await this.clinicModel.findById(id).populate(['departmentId']);
    if (!clinic) throw new NotFoundException('Clinic not found');
    return {
      success: true,
      message: 'Clinic retrieved successfully',
      data: clinic,
    };
  }

  async updateClinic(id: string, updateClinicDto: UpdateClinicDto): Promise<ApiResponse<Clinic>> {
    const updatedClinic = await this.clinicModel.findByIdAndUpdate(id, updateClinicDto, { new: true }).populate(['departmentId']);
    if (!updatedClinic) throw new NotFoundException('Clinic not found');
    return {
      success: true,
      message: 'Clinic update successfully',
      data: updatedClinic,
    };
  }

  async deleteClinic(id: string): Promise<ApiResponse<Clinic>> {
    const deletedClinic = await this.clinicModel.findByIdAndDelete(id);
    if (!deletedClinic) throw new NotFoundException('Clinic not found');
    return {
      success: true,
      message: 'Clinic remove successfully',
    };
  }
  async getCountByClinicCollectionId(clinicCollectionId: string): Promise<ApiResponse< {count: number}>> {
    const clinics = await this.clinicModel.find().populate({path:'departmentId',select:"clinicCollectionId", match: { clinicCollectionId: clinicCollectionId },}).lean();
    const count = clinics.filter(clinic => clinic.departmentId !== null).length;


    return {
      success: true,
      message: 'clinic count  in Clinic Collection retrieved successfully',
      data: { count },
    };
  }
}
