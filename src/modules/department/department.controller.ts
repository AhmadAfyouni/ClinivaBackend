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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { extractId } from 'src/common/utlis/paginate';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
@Controller('departments')
@UseGuards(PermissionsGuard)
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const response = await this.userService.getUserById(userId);
    const user = response.data;
    return this.departmentService.createDepartment(
      createDepartmentDto,
      user.plan,
    );
  }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async getAllDepartments(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.departmentService.getAllDepartments(paginationDto, filters);
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async getDepartmentById(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async updateDepartment(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async deleteDepartment(@Param('id') id: string) {
    return this.departmentService.deleteDepartment(id);
  }

  @Get('count/by-cliniccollection/:clinicCollectionId')
  @Permissions(PermissionsEnum.ADMIN)
  getDepartmentCount(@Param('clinicCollectionId') clinicCollectionId: string) {
    return this.departmentService.getCountByClinicCollectionId(
      clinicCollectionId,
    );
  }
}
