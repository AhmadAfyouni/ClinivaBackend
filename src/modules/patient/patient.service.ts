import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { AppointmentDocument,Appointment } from '../appointment/schemas/appointment.schema';
import { EmployeeDocument,Employee } from '../employee/schemas/employee.schema';
@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async createPatient(
    createPatientDto: CreatePatientDto,
  ): Promise<ApiGetResponse<Patient>> {
    const newPatient = new this.patientModel(createPatientDto);
    const savedPatient = await newPatient.save();
    return {
      success: true,
      message: 'patient created successfully',
      data: savedPatient,
    };
  }

  async getAllPatients(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;
  
    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;
  
    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
  
    // إعداد شروط البحث
    const searchConditions: any[] = [];
  
    // تحقق إذا كان يوجد نص للبحث
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الحروف
  
      // إضافة شروط البحث للحقول النصية مثل الاسم والحالة
      searchConditions.push(
        { name: regex },
      
      );
    }
  
    // إزالة مفتاح البحث من الفلاتر قبل تمريرها
    delete filters.search;
  
    // دمج الفلاتر مع شروط البحث
    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
    };
  
    // استخدام paginate مع الشروط النهائية
    const result = await paginate(this.patientModel, [], page, limit, allData, finalFilter, sort);
  
    // إضافة آخر زيارة للمريض مع اسم الطبيب
    if (result.data) {
      const patients = result.data;
      const updatedPatients = await Promise.all(
        patients.map(async (patient) => {
          // جلب آخر زيارة للمريض من جدول المواعيد
          const lastAppointment = await this.appointmentModel
            .findOne({ patientId: patient._id.toString })
            .sort({ datetime: -1 })  // ترتيب حسب تاريخ ووقت الزيارة من الأحدث إلى الأقدم
         
            .exec();
            let doctorName = "";
            if (lastAppointment && lastAppointment.doctor) {
              const doctor = await this.employeeModel.findById(lastAppointment.doctor);
              doctorName = doctor ? doctor.name : " ";
            }
          // إضافة آخر زيارة مع اسم الطبيب إلى بيانات المريض
          return {
            ...patient.toObject(),
            lastVisit: lastAppointment ? lastAppointment.datetime : null,
           doctorName // تحقق من وجود الطبيب قبل الوصول إلى اسمه
          };
        })
      );
      result.data = updatedPatients;
    }
  
    return result;
  }
  
  async getPatientById(id: string): Promise<ApiGetResponse<Patient>> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) throw new NotFoundException('Patient not found');
    return {
      success: true,
      message: 'patient retrieved successfully',
      data: patient,
    };
  }

  async updatePatient(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<ApiGetResponse<Patient>> {
    const updatedPatient = await this.patientModel
      .findByIdAndUpdate(id, updatePatientDto, { new: true })
      .exec();
    if (!updatedPatient) throw new NotFoundException('Patient not found');
    return {
      success: true,
      message: 'Patient update successfully',
      data: updatedPatient,
    };
  }

  async deletePatient(id: string): Promise<ApiGetResponse<Patient>> {
    const deletedPatient = await this.patientModel.findByIdAndDelete(id).exec();
    if (!deletedPatient) throw new NotFoundException('Patient not found');
    return {
      success: true,
      message: 'Patient remove successfully',
      data: {} as Patient,
    };
  }
}
