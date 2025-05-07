import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MedicalRecord,
  MedicalRecordDocument,
} from './schemas/medicalrecord.schema';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecordDocument>,
  ) {}

  async createMedicalRecord(
    createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<ApiGetResponse<MedicalRecord>> {
    try {
      const publicId = await generateUniquePublicId(
        this.medicalRecordModel,
        'me',
      );
      const newRecord = new this.medicalRecordModel({
        ...createMedicalRecordDto,
        publicId,
      });
      const savedRecord = await newRecord.save();
      return {
        success: true,
        message: 'Medical Record created successfully',
        data: savedRecord,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getAllMedicalRecords(
    paginationDto: PaginationAndFilterDto,
    filters: any,
  ) {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      // Convert page & limit to numbers
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField: string = sortBy ?? 'id';
      const sort: Record<string, number> = {
        [sortField]: order === 'asc' ? 1 : -1,
      };
      return paginate(
        this.medicalRecordModel,
        ['appointment'],
        page,
        limit,
        allData,
        filters,
        sort,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getMedicalRecordById(
    id: string,
  ): Promise<ApiGetResponse<MedicalRecord>> {
    try {
      const record = await this.medicalRecordModel
        .findById(id)
        .populate('appointment')
        .exec();
      if (!record) throw new NotFoundException('Medical Record not found');
      return {
        success: true,
        message: 'Medical Record retrieved successfully',
        data: record,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async updateMedicalRecord(
    id: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<ApiGetResponse<MedicalRecord>> {
    try {
      const updatedRecord = await this.medicalRecordModel
        .findByIdAndUpdate(id, updateMedicalRecordDto, { new: true })
        .exec();
      if (!updatedRecord)
        throw new NotFoundException('Medical Record not found');
      return {
        success: true,
        message: 'Medical Record update successfully',
        data: updatedRecord,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async deleteMedicalRecord(
    id: string,
  ): Promise<ApiGetResponse<MedicalRecord>> {
    try {
      const medicalRecord = await this.medicalRecordModel.findById(id).exec();
      if (!medicalRecord)
        throw new NotFoundException('Medical Record not found');

      medicalRecord.deleted = true;
      const deletedMedicalRecord = await medicalRecord.save();

      return {
        success: true,
        message: 'Medical Record marked as deleted successfully',
        data: deletedMedicalRecord,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
