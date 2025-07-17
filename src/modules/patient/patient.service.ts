import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ApiGetResponse, paginate, SortType } from 'src/common/utils/paginate';
import {
  AppointmentDocument,
  Appointment,
} from '../appointment/schemas/appointment.schema';
import {
  EmployeeDocument,
  Employee,
} from '../employee/schemas/employee.schema';
import {
  MedicalRecordDocument,
  MedicalRecord,
} from '../medicalrecord/schemas/medicalrecord.schema';
import { generateUniquePublicId } from 'src/common/utils/id-generator';
import { saveFileLocally } from 'src/common/utils/upload.util';
import { CreatePatientDto } from './dto/create-patient.dto';
@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecordDocument>,
  ) {}

  async createPatient(
    createPatientDto: CreatePatientDto,
    employee: Employee,
    file: Express.Multer.File,
  ): Promise<ApiGetResponse<Patient>> {
    try {
      const publicId = await generateUniquePublicId(this.patientModel, 'pa');
      const relativeFilePath = file
        ? saveFileLocally(file, 'patients/images')
        : '';
      const internalIdentity =
        employee.employeeType === 'Admin'
          ? employee.identity
          : employee.internalIdentity;
      const newPatient = new this.patientModel({
        ...createPatientDto,
        publicId,
        logo: relativeFilePath || '',
        internalIdentity,
      });
      const savedPatient = await newPatient.save();
      return {
        success: true,
        message: 'patient created successfully',
        data: savedPatient,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async getAllPatients(
    paginationDto: PaginationAndFilterDto,
    employee: Employee,
  ) {
    try {
      let { page, limit, allData, sortBy, order, filter_fields } =
        paginationDto;

      const sortField: string = sortBy ?? 'id';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };
      const filter = filter_fields ? JSON.parse(filter_fields) : {};
      filter['internalIdentity'] =
        employee.employeeType === 'Admin'
          ? employee.identity
          : employee.internalIdentity;
      const result = await paginate({
        model: this.patientModel,
        populate: [],
        page,
        limit,
        allData,
        filter: filter,
        sort: sort,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getPatientById(
    id: string,
    employee: Employee,
  ): Promise<ApiGetResponse<Patient>> {
    try {
      const patient = await this.patientModel.findById(id).exec();

      if (
        !patient ||
        patient.deleted ||
        (patient.internalIdentity !== employee.internalIdentity &&
          patient.internalIdentity !== employee.identity)
      )
        throw new NotFoundException('Patient not found or has been deleted');
      return {
        success: true,
        message: 'patient retrieved successfully',
        data: patient,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async updatePatient(
    id: string,
    updatePatientDto: UpdatePatientDto,
    employee: Employee,
  ): Promise<ApiGetResponse<Patient>> {
    try {
      const updatedPatient = await this.patientModel
        .findByIdAndUpdate(id, updatePatientDto, { new: true })
        .exec();
      if (
        !updatedPatient ||
        updatedPatient.deleted ||
        (updatedPatient.internalIdentity !== employee.internalIdentity &&
          updatedPatient.internalIdentity !== employee.identity)
      )
        throw new NotFoundException('Patient not found or has been deleted');
      return {
        success: true,
        message: 'Patient update successfully',
        data: updatedPatient,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deletePatient(
    id: string,
    employee: Employee,
  ): Promise<ApiGetResponse<Patient>> {
    try {
      const patient = await this.patientModel.findById(id).exec();
      if (
        !patient ||
        patient.deleted ||
        (patient.internalIdentity !== employee.internalIdentity &&
          patient.internalIdentity !== employee.identity)
      )
        throw new NotFoundException('Patient not found or has been deleted');

      patient.deleted = true;
      patient.name = patient.name + ' (Deleted)' + patient.publicId;
      const deletedPatient = await patient.save();

      return {
        success: true,
        message: 'Patient marked as deleted successfully',
        data: deletedPatient,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
