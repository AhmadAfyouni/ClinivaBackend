import { IsNotEmpty, IsOptional, IsString, IsEnum, IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateClinicDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsMongoId()
    departmentId?: Types.ObjectId; // القسم الذي تنتمي له العيادة (اختياري)
}

