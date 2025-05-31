import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import {
  addDateFilter,
  ApiGetResponse,
  applyBooleanFilter,
  buildFinalFilter,
  paginate,
  SortType,
} from 'src/common/utils/paginate';
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
    file: Express.Multer.File,
  ): Promise<ApiGetResponse<Patient>> {
    try {
      const publicId = await generateUniquePublicId(this.patientModel, 'pa');
      const relativeFilePath = file
        ? saveFileLocally(file, 'patients/images')
        : '';
      const newPatient = new this.patientModel({
        ...createPatientDto,
        publicId,
        image: relativeFilePath || '',
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

  async getAllPatients(paginationDto: PaginationAndFilterDto, filters: any) {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      // Convert page & limit to numbers
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField: string = sortBy ?? 'id';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };

      // إعداد شروط البحث
      const searchConditions: any[] = [];
      const filterConditions: any[] = [];
      filters.deleted = { $ne: true };
      await applyBooleanFilter(filters, 'isActive', filterConditions);

      addDateFilter(filters, 'dateOfBirth', searchConditions);
      // تحقق إذا كان يوجد نص للبحث
      if (filters.search) {
        const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الحروف

        // إضافة شروط البحث للحقول النصية مثل الاسم والحالة
        searchConditions.push({ name: regex }, { gender: regex });
      }

      // إزالة مفتاح البحث من الفلاتر قبل تمريرها

      const fieldsToDelete = ['search', 'isActive', 'dateOfBirth'];
      fieldsToDelete.forEach((field) => delete filters[field]);
      // دمج الفلاتر مع شروط البحث
      const finalFilter = buildFinalFilter(
        filters,
        searchConditions,
        filterConditions,
      );

      // استخدام paginate مع الشروط النهائية
      const result = await paginate({
        model: this.patientModel,
        populate: [],
        page,
        limit,
        allData,
        filter: finalFilter,
        sort: sort,
      });

      // إضافة آخر زيارة للمريض مع اسم الطبيب
      if (result.data) {
        const patients = result.data;
      }

      // إضافة آخر زيارة للمريض مع اسم الطبيب
      if (result.data) {
        const patients = result.data;
        const updatedPatients = await Promise.all(
          patients.map(async (patient) => {
            // البحث باستخدام ObjectId مباشرة دون تحويل لـ string
            const lastAppointment = await this.appointmentModel
              .findOne({ patient: patient._id.toString() }) // افترضنا أن patientId من نوع ObjectId
              .sort({ datetime: -1 })
              .select('datetime -_id') // اختيار الحقول المطلوبة فقط لتحسين الأداء
              .lean(); // إرجاع كائن عادي بدل مستند Mongoose

            return {
              ...patient.toObject(),
              lastVisit: lastAppointment?.datetime || null,
            };
          }),
        );

        result.data = updatedPatients;
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getPatientById(id: string): Promise<ApiGetResponse<Patient>> {
    try {
      const patient = await this.patientModel.findById(id).exec();
      if (!patient || patient.deleted)
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
  ): Promise<ApiGetResponse<Patient>> {
    try {
      const updatedPatient = await this.patientModel
        .findByIdAndUpdate(id, updatePatientDto, { new: true })
        .exec();
      if (!updatedPatient || updatedPatient.deleted)
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

  async deletePatient(id: string): Promise<ApiGetResponse<Patient>> {
    try {
      const patient = await this.patientModel.findById(id).exec();
      if (!patient || patient.deleted)
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
