import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {
  }

  @Post()
  @Permissions(PermissionsEnum.PATIENT_CREATE)
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
  }

  @Get()
  @Permissions(PermissionsEnum.PATIENT_VIEW)

  async getAllPatients(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.patientService.getAllPatients(paginationDto, filters);
  }

  @Get(':id')
  @Permissions(PermissionsEnum.PATIENT_VIEW)

  async getPatientById(@Param('id') id: string) {
    return this.patientService.getPatientById(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.PATIENT_UPDATE)

  async updatePatient(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.updatePatient(id, updatePatientDto);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.PATIENT_DELETE)

  async deletePatient(@Param('id') id: string) {
    return this.patientService.deletePatient(id);
  }
}
