import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {AppointmentService} from './appointment.service';
import {Appointment} from './schemas/appointment.schema';
import {CreateAppointmentDto} from "./dto/create-appointment.dto";
import {UpdateAppointmentDto} from "./dto/update-appointment.dto";
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Controller('appointments')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {
    }

    @Post()
    async create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
        return this.appointmentService.createAppointment(createAppointmentDto);
    }

        @Get()
        async findAll(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
            const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    
            return this.appointmentService.getAllAppointments(paginationDto, filters);
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
