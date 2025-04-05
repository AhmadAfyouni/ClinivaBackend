import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ApiResponse, paginate } from 'src/common/utlis/paginate';

@Injectable()
export class AppointmentService {
    constructor(@InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {
    }

    async createAppointment(createAppointmentDto: CreateAppointmentDto):  Promise<ApiResponse<Appointment>> {
        const newAppointment = new this.appointmentModel(createAppointmentDto);

        const savedAppointment =await newAppointment.save(); 
        return {
            success:true,
            message: 'Appointment created successfully',
            data: savedAppointment};
    }

        async getAllAppointments(paginationDto: PaginationAndFilterDto, filters: any) {
            let { page, limit, allData, sortBy, order } = paginationDto;
    
            // Convert page & limit to numbers
            page = Number(page) || 1;
            limit = Number(limit) || 10;
    
            const sortField: string = sortBy ?? 'createdAt';
            const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
            return paginate(this.appointmentModel,['patient', 'clinic', 'doctor'], page, limit, allData, filters, sort);
        }

    async getAppointmentById(id: string):  Promise<ApiResponse<Appointment>> {
        const appointment = await this.appointmentModel.findById(id).populate('patient clinic doctor');
        if (!appointment) throw new NotFoundException('Appointment not found');
        return {
            success:true,
            message: 'Appointment retrieved successfully',
            data:appointment,} ;
    }

    async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto):  Promise<ApiResponse<Appointment>> {
        const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(id, updateAppointmentDto, {new: true}).exec();
        if (!updatedAppointment) throw new NotFoundException('Appointment not found');
        return {success:true,
            message: 'Appointment update successfully',
            data:updatedAppointment,};    }

    async deleteAppointment(id: string):  Promise<ApiResponse<Appointment>> {
        const deletedAppointment = await this.appointmentModel.findByIdAndDelete(id).exec();
        if (!deletedAppointment) throw new NotFoundException('Appointment not found');
        return {
            success:true,
            message: 'Appointment remove successfully',
        }
    }

    async getAppointmentsByClinicId(clinicId: string): Promise<ApiResponse<{ pastAppointments: Appointment[], upcomingAppointments: Appointment[] }>> {
  
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // بداية اليوم الساعة 00:00
      
        const appointments = await this.appointmentModel.find({
          clinic: clinicId,
        }).populate(['doctor','patient']).sort({ datetime: 1 }).exec();
      
        const pastAppointments = appointments.filter(app => app.datetime < today);
        
        const upcomingAppointments = appointments.filter(app => app.datetime >= today);
      
        return {
          success: true,
          message: 'Appointments retrieved successfully',
          data: {
            pastAppointments,
            upcomingAppointments,
          },
        };
      }

    
      async getAppointmentsByDoctorId(doctorId: string): Promise<ApiResponse<{ pastAppointments: Appointment[], upcomingAppointments: Appointment[] }>> {

        const today = new Date();
        today.setHours(0, 0, 0, 0);  // بداية اليوم
      
        const appointments = await this.appointmentModel.find({
          doctor: doctorId,
        }).populate(['clinic','patient'])
        .sort({ datetime: 1 })
        .exec();
      
        const pastAppointments = appointments.filter(app => app.datetime < today);

        const upcomingAppointments = appointments.filter(app => app.datetime >= today);
        return {
          success: true,
          message: 'Doctor Appointments retrieved successfully',
          data: {
            pastAppointments,
            upcomingAppointments,
          },
        };
      }

      async getAppointmentsByPatientId(patientId: string): Promise<ApiResponse<{ pastAppointments: Appointment[], upcomingAppointments: Appointment[] }>> {

        const today = new Date();
        today.setHours(0, 0, 0, 0);  // بداية اليوم
      
        const appointments = await this.appointmentModel.find({
          patient: patientId,  // البحث حسب المريض
        }).populate(['clinic','doctor'])

        .sort({ datetime: 1 }) // ترتيب حسب الوقت
        .exec();
      
        const pastAppointments = appointments.filter(app => app.datetime < today);
      
        const upcomingAppointments = appointments.filter(app => app.datetime >= today);
      
        return {
          success: true,
          message: 'Patient Appointments retrieved successfully',
          data: {
            pastAppointments,
            upcomingAppointments,
          },
        };
      }
      
           
}
