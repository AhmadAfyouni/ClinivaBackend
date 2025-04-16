import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
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

async getAllAppointments(paginationDto: PaginationAndFilterDto, filters: any) {
  let { page, limit, allData, sortBy, order } = paginationDto;

  // Convert page & limit to numbers
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const sortField: string = sortBy ?? 'createdAt';
  const sort: Record<string, number> = {
    [sortField]: order === 'asc' ? 1 : -1,
  };

  const searchConditions: any[] = [];

  // تحقق إذا كان يوجد نص للبحث في الحقول النصية (doctor name, clinic name, patient name)
  if (filters.search) {
    const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الأحرف

    // إضافة شروط البحث للحقول النصية
    searchConditions.push(
      { 'doctor.name': regex },        // البحث في حقل اسم الطبيب
    
      { 'patient.name': regex },       // البحث في حقل اسم المريض
    );
  }

  // إزالة search من الفلاتر قبل تمريره
  delete filters.search;

  // دمج الفلاتر مع شروط البحث
  const finalFilter = {
    ...filters,
    ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
  };

  return paginate(
    this.appointmentModel,
    ['patient', 'clinic', 'doctor'],
    page,
    limit,
    allData,
    finalFilter,
    sort,
  );
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
