import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

import {
  BankAccount,
  CashBox,
  CommercialRecord,
  ContactInfo,
  Holiday,
  InsuranceCompany,
  OnlinePaymentMethod,
  WorkingHours,
} from '../../../common/utlis/helper';
import {
  BankAccountDTO,
  CashBoxDTO,
  CommercialRecordDTO,
  ContactInfoDTO,
  HolidayDTO,
  InsuranceCompanyDTO,
  OnlinePaymentMethodDTO,
  WorkingHoursDTO,
} from 'src/common/utlis/helper.dto';

export class CreateClinicCollectionDto {
  @ApiProperty({
    description: 'Clinic Collection name',
    example: 'Saudi Clinics Group',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Brief overview of the clinic collection (اذا مافي شركة)',
    example: 'A leading healthcare provider in Saudi Arabia.',
    required: false,
  })
  @IsOptional()
  @IsString()
  overview?: string;

  @IsNumber()
  @IsOptional()
  patientCapacity: number; // قدرة استيعاب المرضى

  @ApiProperty({
    description: 'General policies of the clinic collection',
    example:
      'The clinic follows strict hygiene standards and ensures the safety of patients.',
    required: false,
  })
  @IsOptional()
  @IsString()
  policies?: string; //  حقل السياسات العامة

  @ApiProperty({
    description: 'Clinic Collection activation status',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Year of establishment',
    example: '2010-05-20',
    required: false,
  })
  @IsOptional()
  @IsDate()
  yearOfEstablishment?: Date;

  @ApiProperty({
    description: 'Clinic Collection address',
    example: '456 Health Street, Jeddah, Saudi Arabia',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Logo URL  (اذا مافي شركة)',
    example: 'https://clinic.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Vision statement (اذا مافي شركة)',
    example: 'Providing the best medical care in the region.',
    required: false,
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({
    description: 'Additional goals  (اذا مافي شركة)',
    example: 'We have over 50 branches across the country.',
    required: false,
  })
  @IsOptional()
  @IsString()
  goals?: string;

  @ApiProperty({
    type: [ContactInfoDTO],
    description: 'Contact information of the clinic collection ',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInfoDTO)
  @IsOptional()
  contactInfos?: ContactInfoDTO[];

  @ApiProperty({
    type: [HolidayDTO],
    description: 'Clinic collection holidays',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HolidayDTO)
  @IsOptional()
  holidays?: HolidayDTO[];

  @ApiProperty({
    type: [WorkingHoursDTO],
    description: 'Working hours of the clinic collection',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursDTO)
  @IsOptional()
  workingDays?: WorkingHoursDTO[];

  @ApiProperty({
    type: [BankAccountDTO],
    description:
      'Bank accounts associated with the clinic collection  (اذا مافي شركة)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankAccountDTO)
  @IsOptional()
  bankAccount?: BankAccountDTO[];

  @ApiProperty({
    type: [InsuranceCompanyDTO],
    description: 'Accepted insurance companies  (اذا مافي شركة)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsuranceCompanyDTO)
  @IsOptional()
  insuranceCompany?: InsuranceCompanyDTO[];

  @ApiProperty({
    type: CommercialRecordDTO,
    description: 'Commercial record of the clinic collection  (اذا مافي شركة)',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CommercialRecordDTO)
  commercialRecord?: CommercialRecordDTO;

  @ApiPropertyOptional({
    type: [CashBoxDTO],
    description: 'Company cash boxes  (اذا مافي شركة)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CashBoxDTO)
  @IsOptional()
  cashBoxes?: CashBoxDTO[];

  @ApiPropertyOptional({
    type: [OnlinePaymentMethodDTO],
    description: 'Accepted online payment methods  (اذا مافي شركة)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnlinePaymentMethodDTO)
  @IsOptional()
  onlinePaymentMethods?: OnlinePaymentMethodDTO[];

  @ApiProperty({
    description: 'Google Maps location coordinates',
    required: false,
    example: { x: 24.7136, y: 46.6753 },
  })
  @IsOptional()
  @IsObject()
  locationGoogl?: { x: number; y: number };

  @ApiProperty({
    description: 'Company ID that the clinic collection belongs to',
    example: '60f7c7b84f1a2c001c8b4567',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  companyId?: Types.ObjectId;

  @ApiProperty({
    description:
      'List of specialization IDs associated with the clinic collection',
    example: ['60f7c7b84f1a2c001c8b4567', '60f7c7b84f1a2c001c8b4568'],
    required: true,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  specializations: Types.ObjectId[];
  @ApiProperty({
    description: 'ID of the employee assigned as the Person in Charge (PIC)',
    example: '6634dce923f91b8f7761d8f2',
    required: true,
  })
  @IsMongoId()
  PIC: string;
}
