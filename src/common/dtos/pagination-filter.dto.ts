import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsIn,
  IsDateString,
  IsArray,
  IsNumberString,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * Base pagination and filtering DTO for API requests
 */
export class PaginationAndFilterDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => Math.max(1, Number(value) || 1))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page (max: 100)',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => Math.min(100, Math.max(1, Number(value) || 10)))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Get all data',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allData?: boolean = false;

  @ApiPropertyOptional({
    description: 'Sorting direction',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Search query string (searches in fields defined by the API)',
    example: 'john',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by creation date (start)',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by creation date (end)',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Transform(({ value, obj }) => {
    if (!obj.startDate) return value;
    return value;
  })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Include soft-deleted records',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDeleted?: boolean = false;

  @ApiPropertyOptional({
    description: 'Comma-separated list of fields to include in the response',
    example: 'id,name,email',
    required: false,
  })
  @IsOptional()
  @IsString()
  fields?: string;

  // @ApiPropertyOptional({
  //   description: 'Object of fields to include in the response',
  //   example: { name: 'john', email: 'john@example.com' },
  //   required: false,
  // })
  // @IsOptional()
  // @IsObject()
  // filter_fields?: { key: string; value: string };

  @ApiPropertyOptional({
    description: 'Object of fields to include in the response',
    example: `{ name: 'john', email: 'john@example.com' }`,
    required: false,
  })
  @IsOptional()
  @IsString()
  filter_fields?: string;

   @ApiPropertyOptional({
    description: 'Filter by deletion status. "true" for inactive, "false" for active.',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  deleted?: boolean; // <-- ADD THIS PROPERTY
}
