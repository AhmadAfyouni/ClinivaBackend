import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { Employee,EmployeeDocument } from '../employee/schemas/employee.schema';
import { Patient,PatientDocument } from '../patient/schemas/patient.schema';
@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Patient.name)
    private patientModel: Model<PatientDocument>,
    @InjectModel(Employee.name)
    private doctorModel: Model<EmployeeDocument>,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<ApiGetResponse<Appointment>> {
    const newAppointment = new this.appointmentModel(createAppointmentDto);

    const savedAppointment = await newAppointment.save();
    return {
      success: true,
      message: 'Appointment created successfully',
      data: savedAppointment,
    };
  }

// async getAllAppointments(paginationDto: PaginationAndFilterDto, filters: any) {
//   let { page, limit, allData, sortBy, order } = paginationDto;

//   // Convert page & limit to numbers
//   page = Number(page) || 1;
//   limit = Number(limit) || 10;

//   const sortField: string = sortBy ?? 'createdAt';
//   const sort: Record<string, number> = {
//     [sortField]: order === 'asc' ? 1 : -1,
//   };

//   const searchConditions: any[] = [];

//   // تحقق إذا كان يوجد نص للبحث في الحقول النصية (doctor name, clinic name, patient name)
//   if (filters.search) {
//     const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الأحرف

//     // إضافة شروط البحث للحقول النصية
//     searchConditions.push(
//       { 'doctor.name': regex },        // البحث في حقل اسم الطبيب
    
//       { 'patient.name': regex },       // البحث في حقل اسم المريض
//     );
//   }

//   // إزالة search من الفلاتر قبل تمريره
//   delete filters.search;

//   // دمج الفلاتر مع شروط البحث
//   const finalFilter = {
//     ...filters,
//     ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
//   };

//   return paginate(
//     this.appointmentModel,
//     ['patient', 'clinic', 'doctor'],
//     page,
//     limit,
//     allData,
//     finalFilter,
//     sort,
//   );
// }

async getAllAppointments(paginationDto: PaginationAndFilterDto, filters: any) {
  let { page, limit, allData, sortBy, order } = paginationDto;

  // تحويل الباجينيشين إلى أرقام
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const sortField: string = sortBy ?? 'createdAt';
  const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };

  let doctorIds: string[] = [];
  let patientIds: string[] = [];
  const searchConditions: any[] = [];
  const searchTerm = filters.search; // استخراج searchTerm من الفلتر
  const filterConditions: any[] = [];
  const allowedStatuses = ['scheduled', 'completed', 'cancelled'];
  if (filters.status) {
    if (allowedStatuses.includes(filters.status)) {
      filterConditions.push({ status: filters.status });
    } else {
      throw new Error(`Invalid status value. Allowed values: ${allowedStatuses.join(', ')}`);
    }
  }
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');

    // البحث في الأطباء
    const doctors = await this.doctorModel.find({ name: searchRegex }).select('_id');
    doctorIds = doctors.map(doc => doc._id.toString());

    // البحث في المرضى
    const patients = await this.patientModel.find({ name: searchRegex }).select('_id');
    patientIds = patients.map(patient => patient._id.toString());

    // بناء شروط البحث
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
  if (filters.datetime) {
    const datetime = new Date(filters.datetime);
    searchConditions.push({ datetime: { $gte: datetime } });
  }
  // تنظيف الفلتر من حقل البحث
  delete filters.search;
  delete filters.status;
 
  // دمج الفلاتر مع شروط البحث
  const finalFilter: Record<string, any> = {
    ...filters,
    ...(searchConditions.length ? { $and: searchConditions } : {}),
    ...(filterConditions.length > 0 ? { $and: filterConditions } : {})
  };

  // الاستعلام مع البوبيوليت
  const result = await paginate(
    this.appointmentModel,
    [
      { path: 'doctor', select: 'name' },
      { path: 'patient', select: 'name' },
      { path: 'clinic', select: 'name' }
    ],
    page,
    limit,
    allData,
    finalFilter,
    sort
  );

  return result;
}


  async getAppointmentById(id: string): Promise<ApiGetResponse<Appointment>> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('patient clinic doctor');
    if (!appointment) throw new NotFoundException('Appointment not found');
    return {
      success: true,
      message: 'Appointment retrieved successfully',
      data: appointment,
    };
  }

  async updateAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<ApiGetResponse<Appointment>> {
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .exec();
    if (!updatedAppointment)
      throw new NotFoundException('Appointment not found');
    return {
      success: true,
      message: 'Appointment update successfully',
      data: updatedAppointment,
    };
  }

  async deleteAppointment(id: string): Promise<ApiGetResponse<Appointment>> {
    const deletedAppointment = await this.appointmentModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedAppointment)
      throw new NotFoundException('Appointment not found');
    return {
      success: true,
      message: 'Appointment remove successfully',
      data: {} as Appointment,
    };
  }
}
