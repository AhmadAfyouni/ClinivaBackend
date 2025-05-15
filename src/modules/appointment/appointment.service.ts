import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import {
  addDateFilter,
  ApiGetResponse,
  applyModelFilter,
  buildFinalFilter,
  paginate,
} from 'src/common/utlis/paginate';
import {
  Employee,
  EmployeeDocument,
} from '../employee/schemas/employee.schema';
import { Patient, PatientDocument } from '../patient/schemas/patient.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
import { Clinic, ClinicDocument } from '../clinic/schemas/clinic.schema';
import { Service } from '../service/schemas/service.schema';
import { MedicalRecordService } from '../medicalrecord/medical-record.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Patient.name)
    private patientModel: Model<PatientDocument>,
    @InjectModel(Employee.name)
    private doctorModel: Model<EmployeeDocument>,
    @InjectModel(Clinic.name)
    private clinicModel: Model<ClinicDocument>,
    @InjectModel(Service.name)
    private serviceModel: Model<Service>,
    private medicalRecordService: MedicalRecordService,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<ApiGetResponse<Appointment>> {
    try {
      const appointmentDate = new Date(createAppointmentDto.datetime);

      // validate service assignment
      const serviceData = await this.serviceModel
        .findById(createAppointmentDto.service)
        .exec();
      if (!serviceData) throw new NotFoundException('Service not found');
      const clinic = await this.clinicModel
        .findById(createAppointmentDto.clinic)
        .exec();
      if (!clinic) {
        throw new NotFoundException('Clinic not found');
      }
      if (
        serviceData.clinic.toString() !== createAppointmentDto.clinic.toString()
      ) {
        throw new BadRequestException('Service is not offered by this clinic');
      }
      if (
        createAppointmentDto.doctor &&
        !serviceData.doctors
          .map((d) => d.toString())
          .includes(createAppointmentDto.doctor.toString())
      ) {
        throw new BadRequestException('Doctor is not assigned to this service');
      }
      // check if clinic in holiday
      if (clinic.holidays) {
        if (clinic.holidays.some((h) => h.date === appointmentDate)) {
          throw new BadRequestException('Clinic is on holiday');
        }
      }
      // conflict checks with service duration
      await this.checkConflict(
        'doctor',
        createAppointmentDto.doctor,
        appointmentDate,
        clinic.AverageDurationOfVisit,
      );
      await this.checkConflict(
        'patient',
        createAppointmentDto.patient,
        appointmentDate,
        clinic.AverageDurationOfVisit,
      );
      await this.checkConflict(
        'clinic',
        createAppointmentDto.clinic,
        appointmentDate,
        clinic.AverageDurationOfVisit,
      );

      const { description, day, startHour, endHour } = this.getClinicTimeSlot(
        clinic,
        appointmentDate,
      );
      if (
        appointmentDate.getUTCHours() < startHour ||
        appointmentDate.getUTCHours() > endHour
      ) {
        throw new BadRequestException(
          `Appointment must be within the time slot [${description}] on ${day}`,
        );
      }

      const publicId = await generateUniquePublicId(
        this.appointmentModel,
        'app',
      );
      const newAppointment = new this.appointmentModel({
        ...createAppointmentDto,
        publicId,
      });
      const savedAppointment = await newAppointment.save();
      await this.medicalRecordService.createMedicalRecord({
        appointment: savedAppointment._id,
        visitType: 'emergency',
        severityLevel: 'moderate',
        diagnosis: 'diagnosis',
        medications: [],
        patient: savedAppointment.patient,
        doctor: savedAppointment.doctor,
      });
      return {
        success: true,
        message: 'Appointment created successfully',
        data: savedAppointment,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  private async checkConflict(
    field: keyof Appointment,
    id: Types.ObjectId | undefined,
    date: Date,
    duration: number,
  ): Promise<void> {
    if (!id) return;

    const windowStart = new Date(date.getTime() - (duration - 1) * 60000);
    const windowEnd = new Date(date.getTime() + (duration - 1) * 60000);

    const existing = await this.appointmentModel
      .findOne({
        [field]: id,
        datetime: { $gte: windowStart, $lte: windowEnd },
        deleted: false,
      })
      .exec();

    if (existing) {
      const label = field.charAt(0).toUpperCase() + field.slice(1);
      throw new BadRequestException(
        `${label} has another appointment within ${duration} minutes of requested time`,
      );
    }
  }

  private getClinicTimeSlot(
    clinic: Clinic & { WorkingHours?: any[] },
    date: Date,
  ): {
    start: number;
    end: number;
    description: string;
    day: string;
    startHour: number;
    endHour: number;
  } {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const day = days[date.getDay()];
    const schedule = clinic.WorkingHours?.find((w) => w.day === day);
    if (!schedule) {
      throw new BadRequestException(`Clinic is closed on ${day}`);
    }
    const { hours: sh, minutes: sm } = this.parseTime(schedule.startTime);
    const { hours: eh, minutes: em } = this.parseTime(schedule.endTime);
    return {
      start: sh * 60 + sm,
      end: eh * 60 + em,
      startHour: sh,
      endHour: eh,
      description: `${schedule.startTime}-${schedule.endTime}`,
      day,
    };
  }

  private parseTime(timeStr: string): { hours: number; minutes: number } {
    if (!timeStr) {
      throw new BadRequestException('Invalid clinic working hours time string');
    }
    const [timePart, modifier = ''] = timeStr.split(' ');
    const [h, m] = timePart.split(':').map(Number);
    let hours = h;
    const minutes = m;
    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }

  async getAllAppointments(
    paginationDto: PaginationAndFilterDto,
    filters: any,
  ) {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField: string = sortBy ?? 'id';

      const sort: Record<string, number> = {
        [sortField]: order === 'asc' ? 1 : -1,
      };

      let doctorIds: string[] = [];
      let patientIds: string[] = [];
      const searchConditions: any[] = [];
      const searchTerm = filters.search; // استخراج searchTerm من الفلتر
      const filterConditions: any[] = [];
      const allowedStatuses = ['scheduled', 'completed', 'cancelled'];
      if (filters.status) {
        if (filters.status === 'null') {
        } else if (allowedStatuses.includes(filters.status)) {
          filterConditions.push({ status: filters.status });
        } else {
          throw new Error(
            `Invalid status value. Allowed values: ${allowedStatuses.join(', ')}`,
          );
        }
      }
      filterConditions.push({ deleted: { $ne: true } });
      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, 'i');

        const doctors = await this.doctorModel
          .find({ name: searchRegex })
          .select('_id');
        doctorIds = doctors.map((doc) => doc._id.toString());

        const patients = await this.patientModel
          .find({ name: searchRegex })
          .select('_id');
        patientIds = patients.map((patient) => patient._id.toString());

        const searchOrConditions: Record<string, any>[] = [];

        if (doctorIds.length) {
          searchOrConditions.push({ doctor: { $in: doctorIds } });
        }

        if (patientIds.length) {
          searchOrConditions.push({ patient: { $in: patientIds } });
        }

        if (searchOrConditions.length) {
          searchConditions.push({ $or: searchOrConditions });
        } else {
          return { data: [], total: 0, page, limit, totalPages: 0 };
        }
      }
      const doctorsResult = await applyModelFilter(
        this.doctorModel,
        filters,
        'doctorName',
        'name',
        'doctor',
        filterConditions,
        page,
        limit,
      );

      const patientResult = await applyModelFilter(
        this.patientModel,
        filters,
        'patientName',
        'name',
        'patient',
        filterConditions,
        page,
        limit,
      );

      addDateFilter(filters, 'datetime', searchConditions);

      await this.viewWonerAppointment(filters);
      const fieldsToDelete = [
        'search',
        'status',
        'doctorName',
        'patientName',
        'datetime',
        'employeeId',
      ];
      fieldsToDelete.forEach((field) => delete filters[field]);

      const finalFilter = buildFinalFilter(
        filters,
        searchConditions,
        filterConditions,
      );

      const result = await paginate(
        this.appointmentModel,
        [
          { path: 'doctor', select: 'name' },
          { path: 'patient', select: 'name' },
          { path: 'clinic', select: 'name' },
        ],
        page,
        limit,
        allData,
        finalFilter,
        sort,
      );

      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  private async viewWonerAppointment(filters: any) {
    try {
      if (filters.employeeId) {
        const employee = await this.doctorModel.findById(
          filters.employeeId.toString(),
        );
        if (employee?.employeeType === 'Doctor') {
          filters.doctor = filters.employeeId;
        } else if (employee?.employeeType === 'Other') {
          const clinicIds = employee.clinics || [];
          filters.clinic = { $in: clinicIds };
        }
        delete filters.employeeId;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  async getAppointmentById(id: string): Promise<ApiGetResponse<Appointment>> {
    try {
      const appointment = await this.appointmentModel
        .findById(id)
        .populate('patient clinic doctor');
      if (!appointment || appointment.deleted)
        throw new NotFoundException(
          'Appointment not found or has been deleted',
        );
      return {
        success: true,
        message: 'Appointment retrieved successfully',
        data: appointment,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async updateAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<ApiGetResponse<Appointment>> {
    try {
      const updatedAppointment = await this.appointmentModel
        .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
        .exec();
      if (!updatedAppointment || updatedAppointment.deleted)
        throw new NotFoundException(
          'Appointment not found or has been deleted',
        );
      return {
        success: true,
        message: 'Appointment update successfully',
        data: updatedAppointment,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteAppointment(id: string): Promise<ApiGetResponse<Appointment>> {
    try {
      const appointment = await this.appointmentModel.findById(id).exec();
      if (!appointment || appointment.deleted)
        throw new NotFoundException(
          'Appointment not found or has been deleted',
        );

      appointment.deleted = true;
      appointment.publicId = appointment.publicId + ' (Deleted)';
      const deletedAppointment = await appointment.save();

      return {
        success: true,
        message: 'Appointment marked as deleted successfully',
        data: deletedAppointment,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
