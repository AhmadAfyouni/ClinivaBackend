import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';
import { PermissionsEnum } from 'src/config/permission.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';

import {
  ParseFilePipe, // <-- Import
  MaxFileSizeValidator, // <-- Import
  FileTypeValidator, // <-- Import
} from '@nestjs/common';
import { ParseJsonPipe } from 'src/common/pipes/parse-json.pipe';

@Controller('companies')
@UseGuards(PermissionsGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: { userId: string } },
  ) {
    const user_id = req.user.userId;
    return this.companyService.create(createCompanyDto, user_id, file);
  }

  // @Get()
  // @Permissions(PermissionsEnum.ADMIN)
  // async findAll(
  //   @Query() paginationDto: PaginationAndFilterDto,
  //   @Query() queryParams: any,
  // ) {
  //   {
  //     const {
  //       page,
  //       limit,
  //       allData,
  //       sortBy,
  //       order,
  //       search,
  //       deleted,
  //       ...filters
  //     } = queryParams;

  //     return this.companyService.findAll(paginationDto, filters);
  //   }
  // }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.companyService.update(id, updateCompanyDto, file);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.NOT_ALLOW)
  async remove(@Param('id') id: string) {
    throw new BadRequestException('You are not allowed to delete a company');
    // return this.companyService.remove(id);
  }
}
