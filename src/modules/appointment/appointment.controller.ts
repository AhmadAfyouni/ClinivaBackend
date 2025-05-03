import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { AppointmentModule } from './appointment.module';
@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    if (!userId) throw new BadRequestException('User ID is missing');
    
    const response = await this.userService.getUserById(userId);
    
    const user = response?.data;
    // if (!user || !user.employeeId) {
    //   throw new NotFoundException('User or Employee ID not found');
    // }
    
 
    const employeeId =
      typeof user.employeeId === 'string'
        ? user.employeeId
        : user.employeeId._id?.toString() || user.employeeId.toString();
    
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    filters.employeeId = employeeId;
    
    return this.appointmentService.getAllAppointments(paginationDto, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.appointmentService.deleteAppointment(id);
  }
}
