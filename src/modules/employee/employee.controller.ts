import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('employees')
@UseGuards(PermissionsGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createEmployee(
    @UploadedFile() file: Express.Multer.File,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeeService.createEmployee(createEmployeeDto, file);
  }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async getAllEmployees(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.employeeService.getAllEmployees(paginationDto, filters);
  }

  @Get('without-user')
  @Permissions(PermissionsEnum.ADMIN)
  async getEmployeesWithoutUser() {
    return this.employeeService.getEmployeesWithoutUser();
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async getEmployeeById(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async deleteEmployee(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }

  /*@Get('count-doctor/by-cliniccollection/:clinicCollectionId')
  getDepartmentCount(@Param('clinicCollectionId') clinicCollectionId: string) {
    return this.employeeService.getCountDoctorByClinicCollectionId(clinicCollectionId);
  }*/
}
