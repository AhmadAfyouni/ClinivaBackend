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
  UseGuards,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
@Controller('clinics')
@UseGuards(PermissionsGuard)
export class ClinicController {
  constructor(
    private readonly clinicService: ClinicService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  async createClinic(@Body() createClinicDto: CreateClinicDto, @Request() req) {
    const userId = req.user.userId;
    const response = await this.userService.getUserById(userId);
    const user = response.data;
    return this.clinicService.createClinic(createClinicDto, user.plan);
  }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async getAllClinics(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.clinicService.getAllClinics(paginationDto, filters);
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async getClinicById(@Param('id') id: string) {
    return this.clinicService.getClinicById(id);
  }

  @Get('by-department/:deptId')
  @Permissions(PermissionsEnum.ADMIN)
  async getClinicsByDepartment(@Param('deptId') deptId: string) {
    return this.clinicService.getClinicsByDepartment(deptId);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async updateClinic(
    @Param('id') id: string,
    @Body() updateClinicDto: UpdateClinicDto,
  ) {
    return this.clinicService.updateClinic(id, updateClinicDto);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async deleteClinic(@Param('id') id: string) {
    return this.clinicService.deleteClinic(id);
  }

  @Get('count/by-cliniccollection/:clinicCollectionId')
  @Permissions(PermissionsEnum.ADMIN)
  getDepartmentCount(@Param('clinicCollectionId') clinicCollectionId: string) {
    return this.clinicService.getCountByClinicCollectionId(clinicCollectionId);
  }

  @Get(':id/patient-count')
  @Permissions(PermissionsEnum.ADMIN)
  getClinicPatientCount(@Param('id') clinicId: string) {
    return this.clinicService.getClinicPatientCount(clinicId);
  }
}
