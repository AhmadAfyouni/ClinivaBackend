import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
@Controller('services')
@UseGuards(PermissionsGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.serviceService.create(createServiceDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    const { page, limit, allData, sortBy, order, search, ...filters } = query;
    return await this.serviceService.findAll(
      { page, limit, allData, sortBy, order, search },
      filters,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.serviceService.findOne(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async update(@Param('id') id: string, @Body() updateServiceDto: any) {
    return await this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.serviceService.deleteService(id);
  }
}
