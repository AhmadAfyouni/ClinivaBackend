import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clinic, ClinicDocument } from './schemas/clinic.schema';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import {
  ApiGetResponse,
  applyBooleanFilter,
  applyModelFilter,
  buildFinalFilter,
  paginate,
  SortType,
} from 'src/common/utils/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import {
  Appointment,
  AppointmentDocument,
} from '../appointment/schemas/appointment.schema';
import {
  MedicalRecord,
  MedicalRecordDocument,
} from '../medicalrecord/schemas/medicalrecord.schema';
import {
  SpecializationDocument,
  Specialization,
} from '../specialization/schemas/specialization.schema';
import { generateUniquePublicId } from 'src/common/utils/id-generator';
import {
  Employee,
  EmployeeDocument,
} from '../employee/schemas/employee.schema';
import { Service } from '../service/schemas/service.schema';

@Injectable()
export class ClinicService {
  constructor(
    @InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecordDocument>,
    @InjectModel(Specialization.name)
    private specializationModel: Model<SpecializationDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}
  private async checkUniqueName(name: string, departmentId: string) {
    const existingClinic = await this.clinicModel.findOne({
      name,
      departmentId,
    });

    if (existingClinic) {
      throw new BadRequestException(
        'A clinic with this name already exists in the specified department.',
      );
    }
  }
  async createClinic(
    createClinicDto: CreateClinicDto,
    plan: string,
  ): Promise<ApiGetResponse<Clinic>> {
    try {
      if (plan != 'clinic' && !createClinicDto.departmentId) {
        throw new BadRequestException(
          'departmentId is required for collection plan',
        );
      }
      console.log('createClinicDto', createClinicDto);
      // if (createClinicDto.departmentId) {
      //   await this.checkUniqueName(
      //     createClinicDto.name,
      //     createClinicDto.departmentId.toString(),
      //   );
      // }

      const publicId = await generateUniquePublicId(this.clinicModel, 'cli');

      const newClinic = new this.clinicModel({
        ...createClinicDto,
        publicId,
      });
      const savedClinic = await newClinic.save();
      return {
        success: true,
        message: 'Clinic created successfully',
        data: savedClinic,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  async getAllClinics(paginationDto: PaginationAndFilterDto, filters: any) {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField: string = sortBy ?? 'id';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };

      const searchConditions: any[] = [];
      const filterConditions: any[] = [];
      let specializationIds: string[] = [];
      await applyBooleanFilter(filters, 'isActive', filterConditions);

      if (filters.search) {
        const regex = new RegExp(filters.search, 'i');
        searchConditions.push({ name: regex });

        const specializations = await this.specializationModel
          .find({ name: regex })
          .select('_id');
        specializationIds = specializations.map((spec) => spec._id.toString());

        if (specializationIds.length) {
          searchConditions.push({
            specializations: { $in: specializationIds },
          });
        }
      }

      await applyModelFilter(
        this.specializationModel,
        filters,
        'specializationName',
        'name',
        'specializations',
        filterConditions,
        page,
        limit,
      );

      const fieldsToDelete = ['search', 'isActive', 'specializationName'];
      fieldsToDelete.forEach((field) => delete filters[field]);
      filterConditions.push({ deleted: { $ne: true } });

      const finalFilter = buildFinalFilter(
        filters,
        searchConditions,
        filterConditions,
      );

      const populateFields = [
        { path: 'departmentId' },
        { path: 'specializations', select: 'name' },
        { path: 'insuranceCompany' },
      ];

      const result = await paginate({
        model: this.clinicModel,
        populate: populateFields,
        page,
        limit,
        allData,
        filter: finalFilter,
        sort: sort,
      });

      // إحصائيات لكل عيادة
      if (result.data) {
        const clinics = result.data;
        const updatedClinics = await Promise.all(
          clinics.map((clinic) => this.addStatsToClinic(clinic)),
        );
        result.data = updatedClinics;
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  async addStatsToClinic(clinic: any) {
    console.log(`🔍 Clinic: ${clinic.name} (ID: ${clinic._id})`);

    // 1. الحصول على المواعيد المرتبطة بهذه العيادة
    const appointments = await this.appointmentModel
      .find({
        clinic: clinic._id.toString(),
      })
      .select('_id');

    const appointmentIds = appointments.map((a) => a._id.toString());
    const appointmentCount = appointmentIds.length;

    let treatedPatientCount = 0;

    if (appointmentCount > 0) {
      // 2. حساب عدد السجلات الطبية المرتبطة بهذه المواعيد (عدد المرضى المعالجين)
      treatedPatientCount = await this.medicalRecordModel.countDocuments({
        appointment: { $in: appointmentIds },
      });

      console.log(
        `🩺 Treated patients in clinic "${clinic.name}": ${treatedPatientCount}`,
      );
    }

    return {
      ...(clinic.toObject?.() ?? clinic),
      treatedPatientCount,
    };
  }

  async getEmployeeCountByDoctorType(
    clinicId: string,
    doctorType: string = 'Doctor',
  ): Promise<number> {
    const count = await this.employeeModel.countDocuments({
      clinics: clinicId,
      employeeType: doctorType,
    });
    return count;
  }
  async getClinicById(id: string): Promise<ApiGetResponse<Clinic>> {
    try {
      const [
        clinic,
        patientCount,
        employeeCounts,
        doctors,
        services,
        employees,
        ,
      ] = await Promise.all([
        this.clinicModel
          .findById(id)
          .populate(['departmentId', 'specializations', 'insuranceCompany']),
        this.appointmentModel.countDocuments({ clinic: id }),
        Promise.all([
          this.getEmployeeCountByDoctorType(id, 'Doctor'),
          this.getEmployeeCountByDoctorType(id, 'Nurse'),
          this.getEmployeeCountByDoctorType(id, 'Technician'),
          this.getEmployeeCountByDoctorType(id, 'Administrative'),
        ]),
        // fetch full doctor details for this clinic
        this.employeeModel
          .find({ clinics: id, employeeType: 'Doctor' })
          .populate(['departmentId', 'specializations']),
        this.serviceModel.find({ clinic: id }).populate(['doctors']),
        this.employeeModel.find({ clinics: id }).select('name'),
      ]);

      if (!clinic || clinic.deleted) {
        throw new NotFoundException('Clinic not found or has been deleted');
      }
      console.log('@@@@@employees', employees);

      const clinicObj = clinic.toObject();
      clinicObj['patientCount'] = patientCount;
      clinicObj['employeeCounts'] = {
        doctors: employeeCounts[0],
        nurses: employeeCounts[1],
        technicians: employeeCounts[2],
        administrative: employeeCounts[3],
        total: employeeCounts.reduce((a, b) => a + b, 0),
      };
      clinicObj['doctors'] = doctors;
      clinicObj['services'] = services;
      clinicObj['employees'] = employees;

      return {
        success: true,
        message: 'Clinic retrieved successfully',
        data: clinicObj,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve clinic');
    }
  }

  async updateClinic(
    id: string,
    updateClinicDto: UpdateClinicDto,
  ): Promise<ApiGetResponse<Clinic>> {
    try {
      const updatedClinic = await this.clinicModel
        .findByIdAndUpdate(id, updateClinicDto, { new: true })
        .populate(['departmentId']);
      if (!updatedClinic || updatedClinic.deleted)
        throw new NotFoundException('Clinic not found or has been deleted');
      return {
        success: true,
        message: 'Clinic update successfully',
        data: updatedClinic,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteClinic(id: string): Promise<ApiGetResponse<Clinic>> {
    try {
      const clinic = await this.clinicModel.findById(id).exec();
      if (!clinic || clinic.deleted)
        throw new NotFoundException('Clinic not found or has been deleted');

      clinic.deleted = true;
      clinic.name = clinic.name + ' (Deleted)' + clinic.publicId;
      const deletedClinic = await clinic.save();

      return {
        success: true,
        message: 'Clinic marked as deleted successfully',
        data: deletedClinic,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getCountByClinicCollectionId(
    clinicCollectionId: string,
  ): Promise<ApiGetResponse<{ count: number }>> {
    const clinics = await this.clinicModel
      .find()
      .populate({
        path: 'departmentId',
        select: 'clinicCollectionId',
        match: { clinicCollectionId: clinicCollectionId },
      })
      .lean();
    const count = clinics.filter(
      (clinic) => clinic.departmentId !== null,
    ).length;

    return {
      success: true,
      message: 'clinic count  in Clinic Collection retrieved successfully',
      data: { count },
    };
  }

  async getClinicPatientCount(
    clinicId: string,
  ): Promise<ApiGetResponse<{ patientCount: number }>> {
    // Get unique patient count from appointments for this clinic
    const uniquePatients = await this.appointmentModel.distinct('patientId', {
      clinicId: clinicId,
    });

    return {
      success: true,
      message: 'Patient count retrieved successfully',
      data: { patientCount: uniquePatients.length },
    };
  }

  async getClinicsByDepartment(
    departmentId: string,
  ): Promise<ApiGetResponse<any>> {
    const clinics = await this.clinicModel
      .find({ departmentId })
      .populate(['departmentId', 'specializations', 'insuranceCompany'])
      .exec();
    return {
      success: true,
      message: 'Clinics by department retrieved successfully',
      data: clinics,
    };
  }
}
