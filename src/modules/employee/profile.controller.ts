import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request & { user: { userId: string } }) {
    try {
      return await this.employeeService.getEmployeeById(req.user.userId);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to retrieve profile',
      );
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
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
  async updateProfile(
    @Body() updateUserDto: CreateEmployeeDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      workPermit?: Express.Multer.File[];
      CV?: Express.Multer.File[];
      certifications?: Express.Multer.File[];
      employmentContract?: Express.Multer.File[];
    },
    @Req() req: Request & { user: { userId: string } },
  ) {
    try {
      return await this.employeeService.updateEmployee(
        req.user.userId,
        updateUserDto,
        files,
        req.user.userId,
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to update profile',
      );
    }
  }
}
