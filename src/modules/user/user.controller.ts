import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/password.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

   @Get()
   async findAll(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
       const { page, limit, allData, sortBy, order, ...filters } = queryParams;
       return this.userService.getAllUsers(paginationDto, filters);
   }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }


  @Patch(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return { message: await this.userService.resetPassword(id, dto.newPassword) };
  }

  @Patch(':id/change-password')
  async changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return { message: await this.userService.changePassword(id, dto.currentPassword, dto.newPassword) };
  }
}
