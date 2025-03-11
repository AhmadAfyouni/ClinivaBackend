import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateClinicCollectionDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsMongoId()
    companyId?: Types.ObjectId; // مرجع إلى الشركة المالكة (اختياري)

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    departments?: Types.ObjectId[]; // قائمة معرفات الأقسام
}
