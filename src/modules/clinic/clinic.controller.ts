import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ClinicService} from './clinic.service';
import {CreateClinicDto} from "./dto/create-clinic.dto";
import {UpdateClinicDto} from "./dto/update-clinic.dto";

@Controller('clinics')
export class ClinicController {
    constructor(private readonly clinicService: ClinicService) {
    }

    @Post()
    async createClinic(@Body() createClinicDto: CreateClinicDto) {
        return this.clinicService.createClinic(createClinicDto);
    }

    @Get()
    async getAllClinics() {
        return this.clinicService.getAllClinics();
    }

    @Get(':id')
    async getClinicById(@Param('id') id: string) {
        return this.clinicService.getClinicById(id);
    }

    @Put(':id')
    async updateClinic(@Param('id') id: string, @Body() updateClinicDto: UpdateClinicDto) {
        return this.clinicService.updateClinic(id, updateClinicDto);
    }

    @Delete(':id')
    async deleteClinic(@Param('id') id: string) {
        return this.clinicService.deleteClinic(id);
    }
}
