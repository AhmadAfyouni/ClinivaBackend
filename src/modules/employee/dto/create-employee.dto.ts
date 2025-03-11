import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkingHours } from '../../../common/helper';

export class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string;  // اسم الموظف

    @IsOptional()
    @IsString()
    phone?: string;  // رقم هاتف الموظف (اختياري)

    @IsOptional()
    @IsString()
    jobTitle?: string;  // المسمى الوظيفي

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => WorkingHours)
    workingHours?: WorkingHours[];
}
