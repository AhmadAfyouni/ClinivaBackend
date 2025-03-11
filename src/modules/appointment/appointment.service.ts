import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import {CreateAppointmentDto} from "./dto/create-appointment.dto";
import {UpdateAppointmentDto} from "./dto/update-appointment.dto";

@Injectable()
export class AppointmentService {
    constructor(@InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {}

    async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        const newAppointment = new this.appointmentModel(createAppointmentDto);
        return newAppointment.save();
    }

    async getAllAppointments(): Promise<Appointment[]> {
        return this.appointmentModel.find().populate('patient clinic doctor').exec();
    }

    async getAppointmentById(id: string): Promise<Appointment> {
        const appointment = await this.appointmentModel.findById(id).populate('patient clinic doctor');
        if (!appointment) throw new NotFoundException('Appointment not found');
        return appointment;
    }

    async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
        const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(id, updateAppointmentDto, { new: true }).exec();
        if (!updatedAppointment) throw new NotFoundException('Appointment not found');
        return updatedAppointment;
    }

    async deleteAppointment(id: string): Promise<void> {
        const deletedAppointment = await this.appointmentModel.findByIdAndDelete(id).exec();
        if (!deletedAppointment) throw new NotFoundException('Appointment not found');
    }
}
