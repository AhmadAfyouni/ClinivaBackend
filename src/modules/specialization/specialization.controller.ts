import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Put,
  Query,
  Request,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
@Controller('specializations')
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService
  ) {}

  @Post()
  async create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationService.createSpecialization(createSpecializationDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
  
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    
    return this.specializationService.getAllSpecializations(paginationDto, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.specializationService.getSpecializationById(id);
  }

  @Put(':id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateSpecializationDto,
  ) {
    return this.specializationService.updateSpecialization(id, updateRoleDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.specializationService.deleteSpecialization(id);
  }
}
