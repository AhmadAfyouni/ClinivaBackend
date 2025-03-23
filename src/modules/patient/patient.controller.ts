import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {
  }

  @Post()
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
  }

  @Get()
  async getAllPatients(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.patientService.getAllPatients(paginationDto, filters);
  }

  @Get(':id')
  async getPatientById(@Param('id') id: string) {
    return this.patientService.getPatientById(id);
  }

  @Put(':id')
  async updatePatient(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.updatePatient(id, updatePatientDto);
  }

  @Delete(':id')
  async deletePatient(@Param('id') id: string) {
    return this.patientService.deletePatient(id);
  }
}
