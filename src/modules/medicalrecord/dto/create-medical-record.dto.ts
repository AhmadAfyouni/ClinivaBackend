import { IsNotEmpty, IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMedicalRecordDto {
    @IsNotEmpty()
    appointment: Types.ObjectId;  // معرف الموعد المرتبط بالسجل الطبي

    @IsNotEmpty()
    @IsString()
    diagnosis: string;  // التشخيص الطبي

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    medications?: string[];  // قائمة الأدوية الموصوفة

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    labTests?: string[];  // قائمة التحاليل المطلوبة

    @IsOptional()
    @IsString()
    notes?: string;  // ملاحظات إضافية من الطبيب

    @IsOptional()
    @IsEnum(['draft', 'finalized'])
    recordStatus?: string;  // حالة السجل الطبي (مسودة أو نهائي)
}
