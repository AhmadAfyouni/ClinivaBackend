import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {
  }

  @Post()
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(createDepartmentDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllDepartments(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any,@CurrentUser() user: any) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    return this.departmentService.getAllDepartments(paginationDto, filters,user.departmentIds);
  }

  @Get(':id')
  async getDepartmentById(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(id);
  }

  @Put(':id')
  async updateDepartment(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    return this.departmentService.deleteDepartment(id);
  }

  @Get('count/by-cliniccollection/:clinicCollectionId')
  getDepartmentCount(@Param('clinicCollectionId') clinicCollectionId: string) {
    return this.departmentService.getCountByClinicCollectionId(clinicCollectionId);
  }

}
