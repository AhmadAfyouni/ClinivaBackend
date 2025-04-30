import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { BankAccountDTO, CashBoxDTO, CommercialRecordDTO, ContactInfoDTO, InsuranceCompanyDTO, OnlinePaymentMethodDTO } from 'src/common/utlis/helper.dto';

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
        description: 'Brief overview of the company',
        example: 'A leading healthcare provider in Saudi Arabia.',
        required: false
    })
    @IsOptional()
    @IsString()
    overview?: string;

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
        description: 'Additional company goals',
        example: 'We operate in multiple cities across Saudi Arabia.',
        required: false
    })
    @IsOptional()
    @IsString()
    goals?: string;

    @ApiPropertyOptional({
        type: [ContactInfoDTO],
        description: 'Contact information of the company',
        required: true,
      
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ContactInfoDTO)
    @IsOptional()
    contactInfos?: ContactInfoDTO[];
/*
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
        type: [WorkingHours],
        description: 'Working hours of the company',
        required: false,
        example: [
            { day: 'Monday',  startTime: '08:00 AM', endTime: '05:00 PM'  },
            { day: 'Tuesday',startTime: '08:00 AM', endTime: '05:00 PM'  }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingHours)
    @IsOptional()
    workingDays?: WorkingHours[];
*/
    @ApiPropertyOptional({
        type: [BankAccountDTO],
        description: 'Bank accounts associated with the company ',
        required: true,  
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BankAccountDTO)
    @IsOptional()
    bankAccount?: BankAccountDTO[];

    @ApiPropertyOptional({ type: [CashBoxDTO], description: 'Company cash boxes', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CashBoxDTO)
    @IsOptional()
    cashBoxes?: CashBoxDTO[];

    @ApiPropertyOptional({ type: [OnlinePaymentMethodDTO], description: 'Accepted online payment methods', required: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OnlinePaymentMethodDTO)
    @IsOptional()
    onlinePaymentMethods?: OnlinePaymentMethodDTO[];

    @ApiPropertyOptional({
        type: [InsuranceCompanyDTO],
        description: 'Accepted insurance companies',
        required: true,
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InsuranceCompanyDTO)
    @IsOptional()
    insuranceCompany?: InsuranceCompanyDTO[];

    @ApiPropertyOptional({
        type: CommercialRecordDTO,
        description: 'Commercial record of the company',
        required: true,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => CommercialRecordDTO)
    commercialRecord?: CommercialRecordDTO;

    @ApiPropertyOptional({
        description: 'Google Maps location coordinates',
        required: false,
        example: { x: 24.7136, y: 46.6753 }
    })
    @IsOptional()
    @IsObject()
    locationGoogl?: { x: number; y: number };
    @ApiProperty({
        description: 'Key member of the organization',
        example: 'John Doe',
        required: true,
      })
      @IsString()
      @IsNotEmpty()
      Key_member: string;
    
      @ApiProperty({
        description: 'Founder of the organization',
        example: 'Jane Smith',
        required: true,
      })
      @IsString()
      @IsNotEmpty()
      Founder: string;
    
      @ApiProperty({
        description: 'Key executives of the organization (comma-separated if multiple)',
        example: 'Alice Johnson, Robert Lee',
        required: true,
      })
      @IsString()
      @IsNotEmpty()
      Executives: string;
}
