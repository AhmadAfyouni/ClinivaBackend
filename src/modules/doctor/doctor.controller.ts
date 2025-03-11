import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './schemas/doctor.schema';
import {CreateDoctorDto} from "./dto/create-doctor.dto";
import {UpdateDoctorDto} from "./dto/update-doctor.dto";

@Controller('doctors')
export class DoctorController {
    constructor(private readonly doctorService: DoctorService) {}

    @Post()
    async createDoctor(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
        return this.doctorService.createDoctor(createDoctorDto);
    }

    @Get()
    async getAllDoctors(): Promise<Doctor[]> {
        return this.doctorService.getAllDoctors();
    }

    @Get(':id')
    async getDoctorById(@Param('id') id: string): Promise<Doctor> {
        return this.doctorService.getDoctorById(id);
    }

    @Patch(':id')
    async updateDoctor(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
        return this.doctorService.updateDoctor(id, updateDoctorDto);
    }

    @Delete(':id')
    async deleteDoctor(@Param('id') id: string): Promise<void> {
        return this.doctorService.deleteDoctor(id);
    }
}
