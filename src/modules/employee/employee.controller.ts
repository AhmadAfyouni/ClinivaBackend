import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
  }

  @Post()
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  async getAllEmployees(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.employeeService.getAllEmployees(paginationDto, filters);
  }


  @Get(':id')
  async getEmployeeById(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(id);
  }

  @Put(':id')
  async updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }

    @Get('count-doctor/by-cliniccollection/:clinicCollectionId')
    getDoctorCount(@Param('clinicCollectionId') clinicCollectionId: string) {
      return this.employeeService.getCountDoctorByClinicCollectionId(clinicCollectionId);
    }

    @Get('count-employee/by-cliniccollection/:clinicCollectionId')
    getEmployeeCount(@Param('clinicCollectionId') clinicCollectionId: string) {
      return this.employeeService.getCounetEmployeeByClinicCollectionId(clinicCollectionId);
    }
 
  @Get('without-doctor/:clinicCollectionId')
  async getEmployeesWithoutDoctorByClinicCollectionId(
    @Param('clinicCollectionId') clinicCollectionId: string,
  ) {
    return this.employeeService.getEmployeesWithoutDoctorByClinicCollectionId(clinicCollectionId);
  }

  @Get('doctors/by-clinic-collection/:clinicCollectionId')
  async getDoctorsByClinicCollectionId(
    @Param('clinicCollectionId') clinicCollectionId: string,
  ) {
    return this.employeeService.getDoctorsByClinicCollectionId(clinicCollectionId);
  }

  @Get('doctors/count/by-specialization/:specializationId')
  async getCountDoctorBySpecializationId(
    @Param('specializationId') specializationId: string,
  ) {
    return this.employeeService.getCountDoctorBySpecializationId(specializationId);
  }

  @Get('doctors/by-clinic/:clinicId')
  async getDoctorsByClinicId(
    @Param('clinicId') clinicId: string,
  ) {
    return this.employeeService.getDoctorsByClinicId(clinicId);
  }

  @Get('by-clinic/:clinicId')
  async getEmployeesByClinicId(
    @Param('clinicId') clinicId: string,
  ) {
    return this.employeeService.getEmployeesByClinicId(clinicId);
  }
  
  }
