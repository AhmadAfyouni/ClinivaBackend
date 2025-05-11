import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
@Controller('specializations')
@UseGuards(PermissionsGuard)
export class SpecializationController {
  constructor(
    private readonly specializationService: SpecializationService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  async create(@Body() createSpecializationDto: CreateSpecializationDto) {
    return this.specializationService.createSpecialization(
      createSpecializationDto,
    );
  }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async findAll(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.specializationService.getAllSpecializations(
      paginationDto,
      filters,
    );
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.specializationService.getSpecializationById(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateSpecializationDto,
  ) {
    return this.specializationService.updateSpecialization(id, updateRoleDto);
  }
  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async delete(@Param('id') id: string) {
    return this.specializationService.deleteSpecialization(id);
  }
}
