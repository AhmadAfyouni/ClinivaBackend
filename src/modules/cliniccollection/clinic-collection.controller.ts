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
  NotFoundException,
  HttpException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ClinicCollectionService } from './clinic-collection.service';
import { CreateClinicCollectionDto } from './dto/create-clinic-collection.dto';
import { UpdateClinicCollectionDto } from './dto/update-clinic-collection.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { Permissions } from 'src/config/permissions.decorator';

import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
@Controller('cliniccollections')
@UseGuards(PermissionsGuard)
export class ClinicCollectionController {
  constructor(
    private readonly clinicCollectionService: ClinicCollectionService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  async createClinicCollection(
    @Body() createClinicCollectionDto: CreateClinicCollectionDto,
    @Request() req,
  ) {
    try {
      const userId = req.user.userId;
      const response = await this.userService.getUserById(userId);
      const user = response.data;
      const employeeId = user.employeeId;
      const employee = await this.employeeService.getEmployeeById(
        employeeId._id.toString(),
      );

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      const companyId = employee;

      return this.clinicCollectionService.createClinicCollection(
        createClinicCollectionDto,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new BadRequestException(
        'Failed to create clinic collection',
        error.message,
      );
    }
  }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async getAllClinicCollections(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.clinicCollectionService.getAllClinicCollections(
      paginationDto,
      filters,
    );
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async getClinicCollectionById(@Param('id') id: string) {
    return this.clinicCollectionService.getClinicCollectionById(id);
  }

  @Get(':id/complex')
  @Permissions(PermissionsEnum.ADMIN)
  async getMedicalComplexById(@Param('id') id: string) {
    return this.clinicCollectionService.getClinicCollectionById(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async updateClinicCollection(
    @Param('id') id: string,
    @Body() updateClinicCollectionDto: UpdateClinicCollectionDto,
  ) {
    return this.clinicCollectionService.updateClinicCollection(
      id,
      updateClinicCollectionDto,
    );
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async deleteClinicCollection(@Param('id') id: string) {
    return this.clinicCollectionService.deleteClinicCollection(id);
  }
}
