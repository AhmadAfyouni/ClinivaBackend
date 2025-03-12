import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { CreateBaseEntityDto } from 'src/inheritance/entity/dto/create-entity.dto';

export class CreateCompanyDto extends CreateBaseEntityDto {
  @IsOptional()
  clinicCollections?: Types.ObjectId[];
}
