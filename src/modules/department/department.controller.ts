import { Body, Controller, Delete, Get, Param, Post, Put, Query ,Request} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,) {
  }


  @Post()
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Get()
  async getAllDepartments(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any,@Request() req,) {
    const userId = req.user.userId;
    const user = await this.userService.getUserById(userId);
    console.log(user)
    const employee = await this.employeeService.getEmployeeById(user.employeeId);
  
    // افتراض أن الموظف مرتبط بقسم واحد عبر حقل departmentId
    const departmentId = employee.departmentId;
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    filters.departmentId = departmentId
    return this.departmentService.getAllDepartments(paginationDto, filters);
  }

  @Get(':id')
  async getDepartmentById(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(id);
  }

  @Put(':id')
  async updateDepartment(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    return this.departmentService.deleteDepartment(id);
  }

  @Get('count/by-cliniccollection/:clinicCollectionId')
  getDepartmentCount(@Param('clinicCollectionId') clinicCollectionId: string) {
    return this.departmentService.getCountByClinicCollectionId(clinicCollectionId);
  }

}
