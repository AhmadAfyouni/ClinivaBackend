import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { PermissionsEnum } from 'src/config/permission.enum';
import { Permissions } from 'src/config/permissions.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { EmployeeService } from '../employee/employee.service';
@Controller('patients')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @Permissions(PermissionsEnum.PATIENT_CREATE)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createPatient(
    @Body() createPatientDto: CreatePatientDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.patientService.createPatient(
      createPatientDto,
      response.data,
      file,
    );
  }

  @Get()
  @Permissions(PermissionsEnum.PATIENT_VIEW)
  async getAllPatients(
    @Query() paginationDto: PaginationAndFilterDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.patientService.getAllPatients(paginationDto, response.data);
  }

  @Get(':id')
  @Permissions(PermissionsEnum.PATIENT_VIEW)
  async getPatientById(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.patientService.getPatientById(id, response.data);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.PATIENT_UPDATE)
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.patientService.updatePatient(
      id,
      updatePatientDto,
      response.data,
    );
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.PATIENT_DELETE)
  async deletePatient(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.patientService.deletePatient(id, response.data);
  }
}
