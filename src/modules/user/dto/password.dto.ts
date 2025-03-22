import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'newStrongPassword123!' })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'newStrongPassword123!' })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;
}
