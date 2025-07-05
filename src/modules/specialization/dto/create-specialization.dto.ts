import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSpecializationDto {
  @ApiProperty({
    example: 'Cardiology',
    description: 'The name of the medical specialization',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Specialized in heart diseases',
    description: 'A brief description of the specialization',
    default: 'Description',
  })
  @IsString()
  @IsOptional()
  description: string = 'Description';

  @ApiPropertyOptional({
    description: 'Whether the specialization is active',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @ApiProperty({
    description: 'Public ID for the specialization',
    example: 'SPEC-12345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  @ApiPropertyOptional({
    description: 'Whether the specialization is deleted',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  deleted: boolean = false;
}
