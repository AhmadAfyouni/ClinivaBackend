import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { EmployeeService } from '../employee/employee.service';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('clinics')
@UseGuards(PermissionsGuard)
export class ClinicController {
  constructor(
    private readonly clinicService: ClinicService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @Permissions(PermissionsEnum.ADMIN)
  async createClinic(
    @Body() createClinicDto: CreateClinicDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createClinicDto, 'createClinicDto');
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    console.log(response.data, 'response.data');
    return this.clinicService.createClinic(
      createClinicDto,
      response.data,
      file,
    );
  }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async getAllClinics(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
    @Request() req,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    const userId = req.user.userId;
    console.log(userId, 'userId');
    const response = await this.employeeService.getEmployeeById(userId);
    console.log(response.data._id, 'response.data');

    return this.clinicService.getAllClinics(
      paginationDto,
      response.data,
      filters,
    );
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async getClinicById(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.clinicService.getClinicById(id, response.data);
  }

  @Get('by-department/:deptId')
  @Permissions(PermissionsEnum.ADMIN)
  async getClinicsByDepartment(
    @Param('deptId') deptId: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.clinicService.getClinicsByDepartment(deptId, response.data);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async updateClinic(
    @Param('id') id: string,
    @Body() updateClinicDto: UpdateClinicDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.clinicService.updateClinic(
      id,
      updateClinicDto,
      file,
      response.data,
    );
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async deleteClinic(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.clinicService.deleteClinic(id, response.data);
  }

  @Get('by-cliniccollection/:clinicCollectionId')
  @Permissions(PermissionsEnum.ADMIN)
  async getDepartmentCount(
    @Param('clinicCollectionId') clinicCollectionId: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const response = await this.employeeService.getEmployeeById(userId);
    return this.clinicService.getClinicByClinicCollectionId(
      clinicCollectionId,
      response.data,
    );
  }

  @Get(':id/patient-count')
  @Permissions(PermissionsEnum.ADMIN)
  getClinicPatientCount(@Param('id') clinicId: string) {
    return this.clinicService.getClinicPatientCount(clinicId);
  }
}
