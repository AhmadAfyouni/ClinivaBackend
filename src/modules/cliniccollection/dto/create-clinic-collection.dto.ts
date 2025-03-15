import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsDate,
    IsMongoId,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

import {
    BankAccount,
    CommercialRecord,
    ContactInfo,
    Holiday,
    InsuranceCompany,
    Specialization,
    WorkingHours
} from '../../../common/utlis/helper';

export class CreateClinicCollectionDto {
    @ApiProperty({ description: 'Clinic Collection name', example: 'Saudi Clinics Group', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Brief introduction of the clinic collection',
        example: 'A leading healthcare provider in Saudi Arabia.',
        required: false
    })
    @IsOptional()
    @IsString()
    introduction?: string;

    @ApiProperty({
        description: 'Year of establishment',
        example: '2010-05-20',
        required: false
    })
    @IsOptional()
    @IsDate()
    yearOfEstablishment?: Date;

    @ApiProperty({ description: 'Clinic Collection address', example: '456 Health Street, Jeddah, Saudi Arabia', required: true })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: 'Logo URL',
        example: 'https://clinic.com/logo.png',
        required: false
    })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiProperty({
        description: 'Vision statement',
        example: 'Providing the best medical care in the region.',
        required: false
    })
    @IsOptional()
    @IsString()
    vision?: string;

    @ApiProperty({
        description: 'Additional details',
        example: 'We have over 50 branches across the country.',
        required: false
    })
    @IsOptional()
    @IsString()
    details?: string;

    @ApiProperty({
        type: [ContactInfo],
        description: 'Contact information of the clinic collection',
        required: false,
        example: [
            { type: 'phone', value: '+966123456789', isPublic: true, subType: 'work' },
            { type: 'email', value: 'info@clinicgroup.com', isPublic: true, subType: 'corporate' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactInfo)
    @IsOptional()
    ContactInfos?: ContactInfo[];

    @ApiProperty({
        type: [Holiday],
        description: 'Clinic collection holidays',
        required: false,
        example: [
            { name: 'Eid Al-Fitr', date: '2025-04-21', reason: 'Public holiday' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Holiday)
    @IsOptional()
    holidays?: Holiday[];

    @ApiProperty({
        type: [Specialization],
        description: 'Specializations available in the clinic collection',
        required: false,
        example: [
            { name: 'Cardiology', description: 'Heart and vascular care' },
            { name: 'Dermatology', description: 'Skin and cosmetic treatments' }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Specialization)
    @IsOptional()
    specialization?: Specialization[];

    @ApiProperty({
        type: [WorkingHours],
        description: 'Working hours of the clinic collection',
        required: false,
        example: [
            { day: 'Monday', timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingHours)
    @IsOptional()
    workingDays?: WorkingHours[];

    @ApiProperty({
        type: [BankAccount],
        description: 'Bank accounts associated with the clinic collection',
        required: false,
        example: [
            {
                accountName: 'Clinic Main Account',
                swiftCode: 'SA123456',
                bankName: 'Al Rajhi Bank',
                accountNumber: '1234567890'
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BankAccount)
    @IsOptional()
    bankAccount?: BankAccount[];

    @ApiProperty({
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

    @ApiProperty({
        type: CommercialRecord,
        description: 'Commercial record of the clinic collection',
        required: false,
        example: {
            recordNumber: '1234567890',
            grantDate: '2015-06-15',
            issueDate: '2015-06-15',
            expirationDate: '2030-06-15',
            taxNumber: '9876543210'
        }
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CommercialRecord)
    commercialRecord?: CommercialRecord;

    @ApiProperty({
        description: 'Google Maps location coordinates',
        required: false,
        example: { x: 24.7136, y: 46.6753 }
    })
    @IsOptional()
    @IsObject()
    locationGoogl?: { x: number; y: number };

    @ApiProperty({
        description: 'Company ID that the clinic collection belongs to',
        example: '60f7c7b84f1a2c001c8b4567',
        required: false
    })
    @IsOptional()
    @IsMongoId()
    companyId?: Types.ObjectId;
}
