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
import {
  ApiGetResponse,
  ApiListResponse,
  paginate,
} from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
import {
  Appointment,
  AppointmentDocument,
} from '../appointment/schemas/appointment.schema';
@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecordDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async createMedicalRecord(
    createMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<ApiGetResponse<MedicalRecord>> {
    try {
      if (createMedicalRecordDto.appointment) {
        const appointment = await this.appointmentModel.findById(
          createMedicalRecordDto.appointment,
        );
        if (!appointment) throw new NotFoundException('Appointment not found');
        createMedicalRecordDto.patient = appointment.patient;
        createMedicalRecordDto.doctor = appointment.doctor;
      } else if (
        !createMedicalRecordDto.patient &&
        !createMedicalRecordDto.doctor
      ) {
        throw new NotFoundException(
          'Appointment or Patient or doctor not found',
        );
      }
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
      throw new BadRequestException(error.message);
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
      filters.deleted = { $ne: true };

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
      throw new BadRequestException(error.message);
    }
  }

  async getMedicalRecordByPatientId(
    patientId: string,
    paginationDto: PaginationAndFilterDto,
    filters: any,
  ): Promise<ApiListResponse<MedicalRecord>> {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      // Convert page & limit to numbers
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField: string = sortBy ?? 'id';
      const sort: Record<string, number> = {
        [sortField]: order === 'asc' ? 1 : -1,
      };
      filters.deleted = { $ne: true };
      const records = await this.medicalRecordModel
        .find({ patient: patientId, deleted: false })
        .populate('appointment', ['patient', 'doctor', 'appointment'])
        .exec();
      if (!records || records.length === 0)
        throw new NotFoundException(
          'Medical Record not found or has been deleted',
        );
      return paginate(
        this.medicalRecordModel,
        ['appointment', 'patient', 'doctor', 'appointment'],
        page,
        limit,
        allData,
        filters,
        sort,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getMedicalRecordById(
    id: string,
  ): Promise<ApiGetResponse<MedicalRecord>> {
    try {
      const record = await this.medicalRecordModel
        .findById(id)
        .populate('appointment', ['patient', 'doctor', 'appointment'])
        .exec();
      if (!record || record.deleted)
        throw new NotFoundException(
          'Medical Record not found or has been deleted',
        );
      return {
        success: true,
        message: 'Medical Record retrieved successfully',
        data: record,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async updateMedicalRecord(
    id: string,
    updateMedicalRecordDto: UpdateMedicalRecordDto,
  ): Promise<ApiGetResponse<MedicalRecord>> {
    try {
      const updatedRecord = await this.medicalRecordModel
        .findByIdAndUpdate(id, updateMedicalRecordDto, { new: true })
        .populate('appointment', ['patient', 'doctor', 'appointment'])
        .exec();
      if (!updatedRecord || updatedRecord.deleted)
        throw new NotFoundException(
          'Medical Record not found or has been deleted',
        );
      return {
        success: true,
        message: 'Medical Record update successfully',
        data: updatedRecord,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteMedicalRecord(
    id: string,
  ): Promise<ApiGetResponse<MedicalRecord>> {
    try {
      const medicalRecord = await this.medicalRecordModel.findById(id).exec();
      if (!medicalRecord || medicalRecord.deleted)
        throw new NotFoundException(
          'Medical Record not found or has been deleted',
        );

      medicalRecord.deleted = true;
      medicalRecord.publicId = medicalRecord.publicId + ' (Deleted)';
      const deletedMedicalRecord = await medicalRecord.save();

      return {
        success: true,
        message: 'Medical Record marked as deleted successfully',
        data: deletedMedicalRecord,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
