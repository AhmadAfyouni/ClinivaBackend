import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateBaseEntityDto } from 'src/inheritance/entity/dto/create-entity.dto';

export class CreateClinicDto extends CreateBaseEntityDto {
  @IsOptional()
  @IsMongoId()
  departmentId?: Types.ObjectId; // القسم الذي تنتمي له العيادة (اختياري)

  @IsOptional()
  @IsMongoId()
  clinicCollectionId?: Types.ObjectId; // المجموعة التي تنتمي إليها العيادة (اختياري)

  @IsOptional()
  @IsEnum(['general', 'specialized'])
  clinicType?: string; // نوع العيادة (عامة أو متخصصة)

  @IsOptional()
  @IsEnum(['active', 'closed', 'under_maintenance'])
  status?: string; // حالة العيادة

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  doctors?: Types.ObjectId[]; // الأطباء

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  employees?: Types.ObjectId[]; // الموظفون الإداريون
}
