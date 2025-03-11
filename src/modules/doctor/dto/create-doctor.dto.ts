import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHours } from '../../../common/utlis/helper';

export class CreateDoctorDto {
    @IsNotEmpty()
    @IsString()
    name: string;  // اسم الطبيب

    @IsOptional()
    @IsString()
    phone?: string;  // رقم هاتف الطبيب (اختياري)

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    specialties?: string[];  // قائمة التخصصات الطبية

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => WorkingHours)
    workingHours?: WorkingHours[];
}
