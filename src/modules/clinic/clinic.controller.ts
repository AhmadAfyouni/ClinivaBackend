import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  async createClinic(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicService.createClinic(createClinicDto);
  }

  @Get()
  async getAllClinics(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.clinicService.getAllClinics(paginationDto, filters);
  }

  @Get(':id')
  async getClinicById(@Param('id') id: string) {
    return this.clinicService.getClinicById(id);
  }

  @Put(':id')
  async updateClinic(
    @Param('id') id: string,
    @Body() updateClinicDto: UpdateClinicDto,
  ) {
    return this.clinicService.updateClinic(id, updateClinicDto);
  }

  @Delete(':id')
  async deleteClinic(@Param('id') id: string) {
    return this.clinicService.deleteClinic(id);
  }

  @Get('count/by-cliniccollection/:clinicCollectionId')
  getDepartmentCount(@Param('clinicCollectionId') clinicCollectionId: string) {
    return this.clinicService.getCountByClinicCollectionId(clinicCollectionId);
  }

  @Get(':id/patient-count')
  getClinicPatientCount(@Param('id') clinicId: string) {
    return this.clinicService.getClinicPatientCount(clinicId);
  }
}
