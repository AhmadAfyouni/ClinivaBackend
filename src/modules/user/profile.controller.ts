import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request & { user: { userId: string } }) {
    try {
      return await this.userService.getUserById(req.user.userId);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to retrieve profile');
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: { userId: string } },
  ) {
    try {
      return await this.userService.UpdateProfile(updateUserDto, req.user.userId);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update profile');
    }
  }
}
