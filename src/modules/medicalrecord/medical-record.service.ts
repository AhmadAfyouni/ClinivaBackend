import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicalRecord, MedicalRecordDocument } from './schemas/medicalrecord.schema';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { ApiResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class MedicalRecordService {
  constructor(@InjectModel(MedicalRecord.name) private medicalRecordModel: Model<MedicalRecordDocument>) {
  }

  async createMedicalRecord(createMedicalRecordDto: CreateMedicalRecordDto): Promise<ApiResponse<MedicalRecord>> {
    const newRecord = new this.medicalRecordModel(createMedicalRecordDto);
    const savedRecord = await newRecord.save();
    return {
      success: true,
      message: 'Medical Record created successfully',
      data: savedRecord,
    };

  }

  async getAllMedicalRecords(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
    return paginate(this.medicalRecordModel, ['appointment'], page, limit, allData, filters, sort);
  }

  async getMedicalRecordById(id: string): Promise<ApiResponse<MedicalRecord>> {
    const record = await this.medicalRecordModel.findById(id).populate('appointment').exec();
    if (!record) throw new NotFoundException('Medical Record not found');
    return {
      success: true,
      message: 'Medical Record retrieved successfully',
      data: record,
    };
  }

  async updateMedicalRecord(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<ApiResponse<MedicalRecord>> {
    const updatedRecord = await this.medicalRecordModel.findByIdAndUpdate(id, updateMedicalRecordDto, { new: true }).exec();
    if (!updatedRecord) throw new NotFoundException('Medical Record not found');
    return {
      success: true,
      message: 'Medical Record update successfully',
      data: updatedRecord,
    };
  }

  async deleteMedicalRecord(id: string): Promise<ApiResponse<MedicalRecord>> {
    const deletedRecord = await this.medicalRecordModel.findByIdAndDelete(id).exec();
    if (!deletedRecord) throw new NotFoundException('Medical Record not found');
    return {
      success: true,
      message: 'Medical Record remove successfully',
    };
  }
}
