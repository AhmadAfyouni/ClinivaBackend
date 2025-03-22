import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {
    BankAccount,
    CommercialRecord,
    ContactInfo,
    Holiday,
    InsuranceCompany,
    Specialization,
    WorkingHours
} from '../../../common/utlis/helper';
import {Types} from 'mongoose';

export class CreateClinicDto {
    @ApiProperty({description: 'Clinic name', example: 'Al Noor Clinic'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({description: 'Add the expected time for each visit in minutes.',example:30})
    @IsNotEmpty()
    @IsNumber()
    AverageDurationOfVisit: number;

    @ApiPropertyOptional({description: 'Brief overview of the clinic'})
    @IsOptional()
    @IsString()
    overview?: string;

    @ApiPropertyOptional({description: 'Year of establishment', example: '2005-06-15'})
    @IsOptional()
    @IsDate()
    yearOfEstablishment?: Date;

    @ApiProperty({description: 'Clinic address', example: '123 Main Street, Riyadh, Saudi Arabia'})
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiPropertyOptional({description: 'Clinic logo URL'})
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional({description: 'Clinic vision statement'})
    @IsOptional()
    @IsString()
    vision?: string;

    @ApiPropertyOptional({description: 'Additional goals about the clinic'})
    @IsOptional()
    @IsString()
    goals?: string;

    @ApiPropertyOptional({type: [ContactInfo], description: 'Contact information of the clinic'})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ContactInfo)
    @IsOptional()
    ContactInfos?: ContactInfo[];

    @ApiPropertyOptional({type: [Holiday], description: 'Clinic holidays'})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Holiday)
    @IsOptional()
    holidays?: Holiday[];

    @ApiPropertyOptional({type: [Specialization], description: 'Clinic specializations'})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Specialization)
    @IsOptional()
    specialization?: Specialization[];

    @ApiPropertyOptional({type: [WorkingHours], description: 'Working hours of the clinic'})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => WorkingHours)
    @IsOptional()
    WorkingHours?: WorkingHours[];

    @ApiPropertyOptional({type: [BankAccount], description: 'Bank accounts of the clinic'})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => BankAccount)
    @IsOptional()
    bankAccount?: BankAccount[];

    @ApiPropertyOptional({type: [InsuranceCompany], description: 'Accepted insurance companies'})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => InsuranceCompany)
    @IsOptional()
    insuranceCompany?: InsuranceCompany[];

    @ApiPropertyOptional({type: CommercialRecord, description: 'Commercial record of the clinic'})
    @IsOptional()
    @ValidateNested()
    @Type(() => CommercialRecord)
    commercialRecord?: CommercialRecord;

    @ApiPropertyOptional({description: 'Google Maps location coordinates', example: {x: 24.7136, y: 46.6753}})
    @IsOptional()
    @IsObject()
    locationGoogl?: { x: number; y: number };

    @ApiPropertyOptional({description: 'Department ID that the clinic belongs to', example: '60f7c7b84f1a2c001c8b4567'})
    @IsOptional()
    @IsMongoId()
    departmentId?: Types.ObjectId;
}
