import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './schemas/appointment.schema';
import {CreateAppointmentDto} from "./dto/create-appointment.dto";
import {UpdateAppointmentDto} from "./dto/update-appointment.dto";

@Controller('appointments')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Post()
    async create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        return this.appointmentService.createAppointment(createAppointmentDto);
    }

    @Get()
    async findAll(): Promise<Appointment[]> {
        return this.appointmentService.getAllAppointments();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Appointment> {
        return this.appointmentService.getAppointmentById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
        return this.appointmentService.updateAppointment(id, updateAppointmentDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.appointmentService.deleteAppointment(id);
    }
}
