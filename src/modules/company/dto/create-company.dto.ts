import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import {
    BankAccount,
    CommercialRecord,
    ContactInfo,
    Holiday,
    InsuranceCompany,
    Specialization,
    WorkingHours
} from '../../../common/utlis/helper';

export class CreateCompanyDto {
    @ApiProperty({ description: 'Company name', example: 'Saudi Health Group', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Company address', example: '789 Corporate Ave, Riyadh, Saudi Arabia', required: true })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiPropertyOptional({
        description: 'Brief introduction of the company',
        example: 'A leading healthcare provider in Saudi Arabia.',
        required: false
    })
    @IsOptional()
    @IsString()
    intro?: string;

    @ApiPropertyOptional({ description: 'Year of establishment', example: '2000-08-15', required: false })
    @IsOptional()
    @IsDate()
    yearOfEstablishment?: Date;

    @ApiPropertyOptional({ description: 'Company logo URL', example: 'https://company.com/logo.png', required: false })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional({
        description: 'Company vision statement',
        example: 'Delivering innovative healthcare solutions to the Middle East.',
        required: false
    })
    @IsOptional()
    @IsString()
    vision?: string;

    @ApiPropertyOptional({
        description: 'Additional company details',
        example: 'We operate in multiple cities across Saudi Arabia.',
        required: false
    })
    @IsOptional()
    @IsString()
    details?: string;

    @ApiPropertyOptional({
        type: [ContactInfo],
        description: 'Contact information of the company',
        required: false,
        example: [
            { type: 'phone', value: '+966501234567', isPublic: true, subType: 'work' },
            { type: 'email', value: 'contact@saudihealthgroup.com', isPublic: true, subType: 'corporate' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactInfo)
    @IsOptional()
    ContactInfos?: ContactInfo[];

    @ApiPropertyOptional({
        type: [Holiday],
        description: 'Company holidays',
        required: false,
        example: [
            { name: 'National Day', date: '2025-09-23', reason: 'Public Holiday' },
            { name: 'Eid Al-Fitr', date: '2025-04-20', reason: 'Religious Holiday' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Holiday)
    @IsOptional()
    holidays?: Holiday[];

    @ApiPropertyOptional({
        type: [Specialization],
        description: 'Company specializations',
        required: false,
        example: [
            { name: 'Cardiology', description: 'Heart-related treatments' },
            { name: 'Pediatrics', description: 'Children healthcare services' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Specialization)
    @IsOptional()
    specialization?: Specialization[];

    @ApiPropertyOptional({
        type: [WorkingHours],
        description: 'Working hours of the company',
        required: false,
        example: [
            { day: 'Monday', timeSlots: [{ startTime: '08:00 AM', endTime: '05:00 PM' }] },
            { day: 'Tuesday', timeSlots: [{ startTime: '08:00 AM', endTime: '05:00 PM' }] }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingHours)
    @IsOptional()
    workingDays?: WorkingHours[];

    @ApiPropertyOptional({
        type: [BankAccount],
        description: 'Bank accounts associated with the company',
        required: false,
        example: [
            {
                accountName: 'Main Company Account',
                swiftCode: 'SA987654321',
                bankName: 'Al Rajhi Bank',
                accountNumber: '9876543210'
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BankAccount)
    @IsOptional()
    bankAccount?: BankAccount[];

    @ApiPropertyOptional({
        type: [InsuranceCompany],
        description: 'Accepted insurance companies',
        required: false,
        example: [
            { companyName: 'Bupa Arabia', companyPhone: '+9661122334455', companyEmail: 'support@bupa.com.sa' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InsuranceCompany)
    @IsOptional()
    insuranceCompany?: InsuranceCompany[];

    @ApiPropertyOptional({
        type: CommercialRecord,
        description: 'Commercial record of the company',
        required: false,
        example: {
            recordNumber: 'CR1234567890',
            grantDate: '2015-05-10',
            issueDate: '2015-05-10',
            expirationDate: '2030-05-10',
            taxNumber: 'TAX987654321'
        }
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CommercialRecord)
    commercialRecord?: CommercialRecord;

    @ApiPropertyOptional({
        description: 'Google Maps location coordinates',
        required: false,
        example: { x: 24.7136, y: 46.6753 }
    })
    @IsOptional()
    @IsObject()
    locationGoogl?: { x: number; y: number };
}
