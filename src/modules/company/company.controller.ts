import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { PermissionsGroupMap } from 'src/config/permissions-group.enum';
import { Permissions } from 'src/config/permissions.decorator';

import { PermissionsEnum } from 'src/config/permission.enum';

@Controller('companies')
@UseGuards(PermissionsGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {
  }

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async findAll(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
    {
      const { page, limit, allData, sortBy, order, ...filters } = queryParams;

      return this.companyService.findAll(paginationDto, filters);
    }
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
