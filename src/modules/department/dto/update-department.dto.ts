import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDepartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string; // اسم القسم

    @IsNotEmpty()
    @IsMongoId()
    clinicCollectionId: Types.ObjectId; // مجموعة العيادات التي ينتمي إليها القسم

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    clinics?: Types.ObjectId[]; // قائمة معرفات العيادات
}

export class UpdateDepartmentDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsMongoId()
    clinicCollectionId?: Types.ObjectId;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    clinics?: Types.ObjectId[];
}
