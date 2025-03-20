import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

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
}
