import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServiceController {
  
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.serviceService.create(createServiceDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    const { page, limit, allData, sortBy, order, ...filters } = query;
    return await this.serviceService.findAll({ page, limit, allData, sortBy, order }, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.serviceService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: any) {
    return await this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.serviceService.remove(id);
  }
}
