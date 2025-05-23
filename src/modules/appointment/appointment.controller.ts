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
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { AppointmentModule } from './appointment.module';
import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/config/permissions.decorator';

@Controller('appointments')
@UseGuards(PermissionsGuard)
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @Permissions(PermissionsEnum.APPOINTMENT_CREATE)
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get()
  @Permissions(PermissionsEnum.APPOINTMENT_VIEW)
  async findAll(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
    @Request() req,
  ) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new BadRequestException('User ID is missing');

      const response = await this.userService.getUserById(userId);

      const user = response?.data;
      if (!user || !user._id) {
        throw new NotFoundException('User not found');
      }

      // Find the employee associated with this user
      const employee = await this.employeeService.findByUserId(user._id.toString());
      if (!employee) {
        throw new NotFoundException('Employee not found for this user');
      }

      const { page, limit, allData, sortBy, order, ...filters } = queryParams;
      filters.employeeId = employee._id.toString();

      return this.appointmentService.getAllAppointments(paginationDto, filters);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @Permissions(PermissionsEnum.APPOINTMENT_VIEW)
  async findOne(@Param('id') id: string) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.APPOINTMENT_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(id, updateAppointmentDto);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.APPOINTMENT_DELETE)
  async remove(@Param('id') id: string) {
    return this.appointmentService.deleteAppointment(id);
  }
}
