import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateBaseEntityDto } from 'src/inheritance/entity/dto/create-entity.dto';

export class CreateClinicCollectionDto extends CreateBaseEntityDto {
  @IsOptional()
  @IsMongoId()
  companyId?: Types.ObjectId; // مرجع إلى الشركة المالكة (اختياري)

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  departments?: Types.ObjectId[]; // قائمة معرفات الأقسام
}
