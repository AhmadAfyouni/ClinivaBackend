import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DayOfWeek } from 'src/common/utils/base.helper';
import { Clinic, ClinicDocument } from './schemas/clinic.schema';
import {
  Department,
  DepartmentDocument,
} from '../department/schemas/department.schema';
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
import {
  deleteFileLocally,
  saveFileLocally,
} from 'src/common/utils/upload.util';
import { validateClinicWorkingHours } from 'src/common/utils/time-utils';
import { Complex } from '../cliniccollection/schemas/cliniccollection.schema';
import { removeFileFromLocal } from 'src/common/utils/file.util';

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
    @InjectModel(Complex.name) private complexModel: Model<Complex>,
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
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
    user: Employee,
    file: Express.Multer.File,
  ): Promise<ApiGetResponse<Clinic>> {
    try {
      if (user.plan === 'clinic') {
        if (user.clinicId) {
          const existingClinic = await this.clinicModel
            .findById(user.clinicId)
            .where({ deleted: false })
            .exec();
          if (existingClinic) {
            throw new BadRequestException(
              'User already has an associated clinic',
            );
          }
        }
      }
      // If clinic has working hours and is part of a department, validate against complex hours
      if (
        createClinicDto.WorkingHours &&
        createClinicDto.WorkingHours.length > 0 &&
        createClinicDto.departmentId
      ) {
        try {
          // Find the department to get the complex (clinicCollectionId in Department schema)
          const department = await this.departmentModel
            .findById(createClinicDto.departmentId)
            .select('clinicCollectionId')
            .lean()
            .exec();

          if (department?.clinicCollectionId) {
            // Find the complex to get its general info which contains working hours
            const complex = await this.complexModel
              .findById(department.clinicCollectionId)
              .select('generalInfo')
              .lean()
              .exec();

            // Check if complex has working hours in generalInfo
            const complexGeneralInfo = complex?.generalInfo as any;
            if (
              complexGeneralInfo?.workingHours &&
              Array.isArray(complexGeneralInfo.workingHours) &&
              complexGeneralInfo.workingHours.length > 0
            ) {
              // Convert complex working hours to the expected format
              const complexWorkingHours = complexGeneralInfo.workingHours.map(
                (wh: any) => ({
                  day: wh.day,
                  shift1: {
                    startTime: wh.shift1?.startTime || '09:00',
                    endTime: wh.shift1?.endTime || '17:00',
                  },
                  shift2: wh.shift2
                    ? {
                        startTime: wh.shift2.startTime,
                        endTime: wh.shift2.endTime,
                      }
                    : undefined,
                }),
              );

              // Convert clinic working hours to match the expected type
              const clinicWorkingHours = createClinicDto.WorkingHours.map(
                (wh) => ({
                  day: wh.day as any, // Cast to any to bypass the enum check
                  shift1: {
                    startTime: wh.shift1.startTime,
                    endTime: wh.shift1.endTime,
                  },
                  shift2: wh.shift2
                    ? {
                        startTime: wh.shift2.startTime,
                        endTime: wh.shift2.endTime,
                      }
                    : undefined,
                }),
              );

              // Validate clinic working hours against complex working hours
              validateClinicWorkingHours(
                clinicWorkingHours,
                complexWorkingHours,
              );
            } else {
              // If complex doesn't have working hours defined, use default working hours
              const defaultWorkingHours = [
                {
                  day: DayOfWeek.Monday,
                  shift1: { startTime: '09:00', endTime: '17:00' },
                },
                {
                  day: DayOfWeek.Tuesday,
                  shift1: { startTime: '09:00', endTime: '17:00' },
                },
                {
                  day: DayOfWeek.Wednesday,
                  shift1: { startTime: '09:00', endTime: '17:00' },
                },
                {
                  day: DayOfWeek.Thursday,
                  shift1: { startTime: '09:00', endTime: '17:00' },
                },
                {
                  day: DayOfWeek.Sunday,
                  shift1: { startTime: '09:00', endTime: '17:00' },
                },
              ] as const;

              const clinicWorkingHours = createClinicDto.WorkingHours.map(
                (wh) => ({
                  day: wh.day as DayOfWeek,
                  shift1: {
                    startTime: wh.shift1.startTime,
                    endTime: wh.shift1.endTime,
                  },
                  shift2: wh.shift2
                    ? {
                        startTime: wh.shift2.startTime,
                        endTime: wh.shift2.endTime,
                      }
                    : undefined,
                }),
              );

              validateClinicWorkingHours(
                clinicWorkingHours,
                defaultWorkingHours as any, // Cast to any to bypass the type check for default hours
              );
            }
          }
        } catch (error: any) {
          // If validation fails, rethrow the error with a more descriptive message
          throw new BadRequestException(
            `Invalid working hours: ${error.message}`,
          );
        }
      }

      if (createClinicDto.departmentId) {
        await this.checkUniqueName(
          createClinicDto.name,
          createClinicDto.departmentId.toString(),
        );
      }

      const publicId = await generateUniquePublicId(this.clinicModel, 'cli');
      let relativeFilePath = '';
      if (file) {
        relativeFilePath = file
          ? saveFileLocally(file, 'clinic/' + publicId + '/images')
          : '';
        createClinicDto.logo = relativeFilePath;
      }
      const newClinic = new this.clinicModel({
        ...createClinicDto,
        publicId,
        logo: relativeFilePath,
        employee: user._id,
      });
      const savedClinic = await newClinic.save();
      if (user.plan === 'clinic') {
        const employeeDoc = await this.employeeModel.findById(user._id);

        if (employeeDoc) {
          employeeDoc.clinicId = savedClinic._id;
          employeeDoc.first_login = false;
          await employeeDoc.save();
        }
      }

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

  async getAllClinics(
    paginationDto: PaginationAndFilterDto,
    employee: Employee,
    filters: any,
  ) {
    try {
      const {
        page,
        limit,
        allData,
        sortBy,
        order,
        search,
        fields,
        filter_fields,
      } = paginationDto;
      const query = {};
      const sortField: string = sortBy ?? 'id';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };
      if (search) {
        query['$or'] = ['legalName'].map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        }));
      }

      const populateFields = [{ path: 'departmentId' }];
      const filter = filter_fields ? JSON.parse(filter_fields) : {};

      filter['$or'] = [
        { employee: employee._id },
        { _id: { $in: employee.clinic } },
      ];

      console.log(filter);
      const result = await paginate({
        model: this.clinicModel,
        populate: populateFields,
        page: page,
        limit: limit,
        allData: allData,
        filter: filter,
        search: search,
        searchFields: ['name', 'generalInfo', 'Description', 'publicId'],
        message: 'Request successful',
        sort: sort,
      });

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
    const appointments = await this.appointmentModel
      .find({
        clinic: clinic._id.toString(),
      })
      .select('_id');

    const appointmentIds = appointments.map((a) => a._id.toString());
    const appointmentCount = appointmentIds.length;

    let treatedPatientCount = 0;

    if (appointmentCount > 0) {
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

  async getClinicById(
    id: string,
    employee: Employee,
  ): Promise<ApiGetResponse<Clinic>> {
    try {
      const clinicById = await this.clinicModel.findById(id);

      if (clinicById) {
        console.log(clinicById.employee);
        console.log(employee._id);
        console.log(clinicById.employee !== employee._id);
        console.log(!employee.clinic.includes(clinicById._id));
      }
      if (
        !clinicById ||
        clinicById.deleted ||
        (clinicById.employee !== employee._id &&
          !employee.clinic.includes(clinicById._id))
      ) {
        throw new NotFoundException('Clinic not found or has been deleted');
      }
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
          .find({ _id: id })
          .populate(['departmentId', 'PIC'])
          .exec()
          .then((clinic) => clinic[0]),
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
    file: Express.Multer.File,
    employee: Employee,
  ): Promise<ApiGetResponse<Clinic>> {
    try {
      const updatedClinic = await this.clinicModel
        .findByIdAndUpdate(id, updateClinicDto, {
          employee: employee._id,
          new: true,
        })
        .populate(['departmentId']);
      if (!updatedClinic || updatedClinic.deleted)
        throw new NotFoundException('Clinic not found or has been deleted');

      let relativeFilePath = '';
      if (file) {
        // removeFileFromLocal(updatedClinic.logo || '');
        // deleteFileLocally(updatedClinic.logo || '');
        relativeFilePath = file
          ? saveFileLocally(
              file,
              'clinic/' + updatedClinic.publicId + '/images',
            )
          : '';
        updatedClinic.logo = relativeFilePath;
      }
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

  async deleteClinic(
    id: string,
    employee: Employee,
  ): Promise<ApiGetResponse<Clinic>> {
    try {
      //if clinic not for the employee denied the id of employee in clinic
      const clinic = await this.clinicModel
        .find({ _id: id, employee: employee._id })
        .exec()
        .then((clinic) => clinic[0]);

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

  async getClinicByClinicCollectionId(
    clinicCollectionId: string,
    employee: Employee,
  ): Promise<ApiGetResponse<{ count: object }>> {
    const clinics = await this.clinicModel
      .find({ deleted: false, employee: employee._id })
      .populate({
        path: 'departmentId',
        select: 'clinicCollectionId',
        match: { clinicCollectionId: clinicCollectionId },
      })
      .lean();
    const ClinicObjects = clinics.filter(
      (clinic) => clinic.departmentId !== null,
    );

    return {
      success: true,
      message: 'clinic count  in Complex retrieved successfully',
      data: { count: ClinicObjects },
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
    employee: Employee,
  ): Promise<ApiGetResponse<any>> {
    const clinics = await this.clinicModel
      .find({ departmentId, employee: employee._id })
      .populate(['departmentId'])
      .exec();
    return {
      success: true,
      message: 'Clinics by department retrieved successfully',
      data: clinics,
    };
  }
}
