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
  BadRequestException,
  UseGuards,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { ClinicCollectionService } from './clinic-collection.service';
import { CreateClinicCollectionDto } from './dto/create-clinic-collection.dto';
import { UpdateClinicCollectionDto } from './dto/update-clinic-collection.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { CompanyService } from '../company/company.service';
import { Permissions } from 'src/config/permissions.decorator';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';

@Controller('cliniccollections')
@UseGuards(PermissionsGuard)
export class ClinicCollectionController {
  constructor(
    private readonly clinicCollectionService: ClinicCollectionService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
    private readonly companyService: CompanyService,
  ) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  @UseInterceptors(FileInterceptor('logo'))
  async createClinicCollection(
    @Body() createClinicCollectionDto: CreateClinicCollectionDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const userId = req.user.userId;

      return this.clinicCollectionService.createClinicCollection(
        createClinicCollectionDto,
        userId,
        file,
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
    console.log('queryParams', queryParams);
    return this.clinicCollectionService.getAllClinicCollections(
      paginationDto,
      // filters,
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
  @UseInterceptors(FileInterceptor('logo'))
  async updateClinicCollection(
    @Param('id') id: string,
    @Body() updateClinicCollectionDto: UpdateClinicCollectionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.clinicCollectionService.updateClinicCollection(
      id,
      updateClinicCollectionDto,
      file,
    );
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async deleteClinicCollection(@Param('id') id: string) {
    return this.clinicCollectionService.deleteClinicCollection(id);
  }
}
