import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
@Controller('medicalrecords')
@UseGuards(PermissionsGuard)
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  @Permissions(PermissionsEnum.MEDICAL_RECORD_CREATE)
  async createMedicalRecord(
    @Body() createMedicalRecordDto: CreateMedicalRecordDto,
  ) {
    return this.medicalRecordService.createMedicalRecord(
      createMedicalRecordDto,
    );
  }

  @Get()
  @Permissions(PermissionsEnum.MEDICAL_RECORD_VIEW)
  async getAllMedicalRecords(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.medicalRecordService.getAllMedicalRecords(
      paginationDto,
      filters,
    );
  }

  @Get(':id')
  @Permissions(PermissionsEnum.MEDICAL_RECORD_VIEW)
  async getMedicalRecordById(@Param('id') id: string) {
    return this.medicalRecordService.getMedicalRecordById(id);
  }

  @Get('patient/:patientId')
  @Permissions(PermissionsEnum.MEDICAL_RECORD_VIEW)
  async getMedicalRecordByPatientId(
    @Param('patientId') patientId: string,
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.medicalRecordService.getMedicalRecordByPatientId(
      patientId,
      paginationDto,
      filters,
    );
  }

  @Put(':id')
  @Permissions(PermissionsEnum.MEDICAL_RECORD_UPDATE)
  async updateMedicalRecord(
    @Param('id') id: string,
    @Body() updateMedicalRecordDto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordService.updateMedicalRecord(
      id,
      updateMedicalRecordDto,
    );
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.MEDICAL_RECORD_DELETE)
  async deleteMedicalRecord(@Param('id') id: string) {
    return this.medicalRecordService.deleteMedicalRecord(id);
  }
}
