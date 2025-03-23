import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ClinicCollectionService } from './clinic-collection.service';
import { CreateClinicCollectionDto } from './dto/create-clinic-collection.dto';
import { UpdateClinicCollectionDto } from './dto/update-clinic-collection.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Controller('cliniccollections')
export class ClinicCollectionController {
  constructor(private readonly clinicCollectionService: ClinicCollectionService) {
  }

  @Post()
  async createClinicCollection(@Body() createClinicCollectionDto: CreateClinicCollectionDto) {
    return this.clinicCollectionService.createClinicCollection(createClinicCollectionDto);
  }

  @Get()
  async getAllClinicCollections(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;

    return this.clinicCollectionService.getAllClinicCollections(paginationDto, filters);
  }

  @Get(':id')
  async getClinicCollectionById(@Param('id') id: string) {
    return this.clinicCollectionService.getClinicCollectionById(id);
  }

  @Put(':id')
  async updateClinicCollection(@Param('id') id: string, @Body() updateClinicCollectionDto: UpdateClinicCollectionDto) {
    return this.clinicCollectionService.updateClinicCollection(id, updateClinicCollectionDto);
  }

  @Delete(':id')
  async deleteClinicCollection(@Param('id') id: string) {
    return this.clinicCollectionService.deleteClinicCollection(id);
  }
}
