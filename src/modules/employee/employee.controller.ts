import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
@Controller('employees')
@UseGuards(PermissionsGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'workPermit', maxCount: 1 },
      { name: 'CV', maxCount: 1 },
      { name: 'certifications', maxCount: 1 },
      { name: 'employmentContract', maxCount: 1 },
    ]),
  )
  async createEmployee(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      workPermit?: Express.Multer.File[];
      CV?: Express.Multer.File[];
      certifications?: Express.Multer.File[];
      employmentContract?: Express.Multer.File[];
    },
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    try {
      console.log(files);
      return this.employeeService.createEmployee(
        createEmployeeDto,
        files?.image?.[0] || undefined,
        files?.workPermit?.[0] || undefined,
        files?.CV?.[0] || undefined,
        files?.certifications?.[0] || undefined,
        files?.employmentContract?.[0] || undefined,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('CreateUser')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @UploadedFile() image: Express.Multer.File,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeeService.createUser(image, createEmployeeDto);
  }

  // @Get()
  // @Permissions(PermissionsEnum.ADMIN)
  // async getAllEmployees(
  //   @Query() paginationDto: PaginationAndFilterDto,
  //   @Query() queryParams: any,
  // ) {
  //   const { page, limit, allData, sortBy, order, ...filters } = queryParams;

  //   return this.employeeService.getAllEmployees(paginationDto, filters);
  // }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async getAllEmployees(@Query() paginationDto: PaginationAndFilterDto) {
    return this.employeeService.getAllEmployees(paginationDto);
  }

  // @Get('without-user')
  // @Permissions(PermissionsEnum.ADMIN)
  // async getEmployeesWithoutUser() {
  //   return this.employeeService.getEmployeesWithoutUser();
  // }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async getEmployeeById(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.employeeService.updateEmployee(
      id,
      updateEmployeeDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async deleteEmployee(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.employeeService.deleteEmployee(id, req.user.userId);
  }

  @Get('resetPassword/:id')
  @Permissions(PermissionsEnum.ADMIN)
  async updatePassword(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string } },
  ) {
    console.log(id);
    return await this.employeeService.resetPassword(id, req.user.userId);
  }
  /*@Get('count-doctor/by-cliniccollection/:clinicCollectionId')
  getDepartmentCount(@Param('clinicCollectionId') clinicCollectionId: string) {
    return this.employeeService.getCountDoctorByClinicCollectionId(clinicCollectionId);
  }*/
}
