import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDepartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string; // اسم القسم

    @IsNotEmpty()
    @IsMongoId()
    clinicCollectionId: Types.ObjectId; // مجموعة العيادات التي ينتمي إليها القسم

}
