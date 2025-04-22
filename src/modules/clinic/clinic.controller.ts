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
  Request
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { extractId } from 'src/common/utlis/paginate';
import { EmployeeService } from '../employee/employee.service';
@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  async createClinic(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicService.createClinic(createClinicDto);
  }

  @Get()
  async getAllClinics(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
    @Request() req
  ) {
    const userId= req.user.userId
    const response = await this.userService.getUserById(userId)
  if (!response.data || Array.isArray(response.data)) {
      throw new NotFoundException('User not found');
    }
    const user = response.data;
    const employeeId = user.employeeId;
    const employee = await this.employeeService.getEmployeeById(
      employeeId.toString(),
    );
    console.log(employee)

    const clinicsId = employee.data?.clinics || [];
    
    console.log(`clinicsId: ${clinicsId}`);
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    if (clinicsId.length > 0) {
      filters.clinicsId = clinicsId;
    }
  
    console.log(`filters.clinicsId: ${filters.clinicsId}`);
  

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
