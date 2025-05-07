import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/password.dto';
import { Permissions } from 'src/config/permissions.decorator';

import { PermissionsEnum } from 'src/config/permission.enum';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
@Controller('users')
@UseGuards(PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permissions(PermissionsEnum.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Permissions(PermissionsEnum.ADMIN)
  async findAll(
    @Query() paginationDto: PaginationAndFilterDto,
    @Query() queryParams: any,
  ) {
    const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    return this.userService.getAllUsers(paginationDto, filters);
  }

  @Get(':id')
  @Permissions(PermissionsEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @Permissions(PermissionsEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Permissions(PermissionsEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Put(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return {
      message: await this.userService.resetPassword(id, dto.newPassword),
    };
  }

  @Put(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return {
      message: await this.userService.changePassword(
        id,
        dto.currentPassword,
        dto.newPassword,
      ),
    };
  }

  @Put(':id/active-status')
  @Permissions(PermissionsEnum.ADMIN)
  async changeActiveStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.userService.changeActiveStatus(id, isActive);
  }
}
