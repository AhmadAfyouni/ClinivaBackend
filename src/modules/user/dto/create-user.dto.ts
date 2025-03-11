import { IsEmail, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsNotEmpty()
    @IsArray()
    roleIds: Types.ObjectId[];

    @IsOptional()
    companyId?: Types.ObjectId;

    @IsOptional()
    clinicCollectionId?: Types.ObjectId;

    @IsOptional()
    departmentId?: Types.ObjectId;

    @IsOptional()
    clinics?: Types.ObjectId[];

    @IsOptional()
    doctorId?: Types.ObjectId;

    @IsOptional()
    employeeId?: Types.ObjectId;
}
