import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateBaseEntityDto } from 'src/inheritance/entity/dto/create-entity.dto';

export class CreateDepartmentDto extends CreateBaseEntityDto {
  @IsNotEmpty()
  @IsMongoId()
  clinicCollectionId: Types.ObjectId; // مجموعة العيادات التي ينتمي إليها القسم

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  clinics?: Types.ObjectId[]; // قائمة معرفات العيادات
}
