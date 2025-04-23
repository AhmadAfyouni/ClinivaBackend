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
} from '@nestjs/common';
import { ClinicCollectionService } from './clinic-collection.service';
import { CreateClinicCollectionDto } from './dto/create-clinic-collection.dto';
import { UpdateClinicCollectionDto } from './dto/update-clinic-collection.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';

@Controller('cliniccollections')
export class ClinicCollectionController {
  constructor(
    private readonly clinicCollectionService: ClinicCollectionService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  async createClinicCollection(
    @Body() createClinicCollectionDto: CreateClinicCollectionDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    console.log('first', userId);
    const response = await this.userService.getUserById(userId);

    if (!response.data || Array.isArray(response.data)) {
      throw new NotFoundException('User not found or response is invalid');
    }

    const user = response.data;
    const employeeId = user.employeeId;
    console.log('Employee ID:', employeeId);
    const employee = await this.employeeService.getEmployeeById(
      employeeId.toString(),
    );
    console.log(0);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    console.log(1);
    // Get the companyId from the employee record
    const companyId = employee;
    console.log('Company ID:', companyId.data.name);
    console.log(2);

    return this.clinicCollectionService.createClinicCollection(
      createClinicCollectionDto,
    );
  }

  @Get()
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
  async getClinicCollectionById(@Param('id') id: string) {
    return this.clinicCollectionService.getClinicCollectionById(id);
  }

  @Put(':id')
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
  async deleteClinicCollection(@Param('id') id: string) {
    return this.clinicCollectionService.deleteClinicCollection(id);
  }
}
