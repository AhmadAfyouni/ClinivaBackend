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
  async updateProfile(
    @Body() updateUserDto: CreateEmployeeDto,
    @Req() req: Request & { user: { userId: string } },
  ) {
    try {
      return await this.employeeService.updateEmployee(
        req.user.userId,
        updateUserDto,
        req.user.userId,
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to update profile',
      );
    }
  }
}
