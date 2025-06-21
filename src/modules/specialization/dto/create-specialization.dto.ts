import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSpecializationDto {
  @ApiProperty({
    example: 'Cardiology',
    description: 'The name of the medical specialization',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Specialized in heart diseases',
    description: 'A brief description of the specialization',
  })
  @IsString()
  description: string;
}
