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
  BankAccountDTO,
  CashBoxDTO,
  CommercialRecordDTO,
  ContactInfoDTO,
  HolidayDTO,
  InsuranceCompanyDTO,
  OnlinePaymentMethodDTO,
  WorkingHoursDTO,
} from 'src/common/utlis/helper.dto';

export class CreateClinicDto {
  @ApiProperty({ description: 'Clinic name', example: 'Al Noor Clinic' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Add the expected time for each visit in minutes.',
    example: 30,
  })
  @IsNotEmpty()
  @IsNumber()
  AverageDurationOfVisit: number;

  @ApiPropertyOptional({
    description: 'Brief overview of the clinic (اذا مافي شركة)',
  })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiProperty({
    description: 'Clinic activation status',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: 'Year of establishment',
    example: '2005-06-15',
  })
  @IsOptional()
  @IsDate()
  yearOfEstablishment?: Date;

  @ApiProperty({
    description: 'Clinic address',
    example: '123 Main Street, Riyadh, Saudi Arabia  (اذا مافي شركة)',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ description: 'Clinic logo image file (upload)', type: 'string', format: 'binary' })
  @IsOptional() // Still optional if the logo itself is optional for a clinic
  @IsString() // This decorator might seem odd for a file, but it's for the field name from swagger. The actual validation of file type/size happens elsewhere.
  logo?: string; // This field is mainly for Swagger, the actual file is handled by @UploadedFile

  @ApiPropertyOptional({
    description: 'Clinic vision statement  (اذا مافي شركة)',
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiPropertyOptional({
    description: 'Additional goals about the clinic  (اذا مافي شركة)',
  })
  @IsOptional()
  @IsString()
  goals?: string;

  @ApiPropertyOptional({
    type: [ContactInfoDTO],
    description: 'Contact information of the clinic',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInfoDTO)
  @IsOptional()
  contactInfos?: ContactInfoDTO[];

  @ApiPropertyOptional({
    type: [HolidayDTO],
    description: 'Clinic holidays  (اذا مافي مجمع)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HolidayDTO)
  @IsOptional()
  holidays?: HolidayDTO[];

  @ApiPropertyOptional({
    type: [WorkingHoursDTO],
    description: 'Working hours of the clinic  (اذا مافي مجمع)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursDTO)
  @IsOptional()
  WorkingHours?: WorkingHoursDTO[];

  @ApiPropertyOptional({
    type: [BankAccountDTO],
    description: 'Bank accounts of the clinic (اذا مافي شركة)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankAccountDTO)
  @IsOptional()
  bankAccount?: BankAccountDTO[];

  @ApiPropertyOptional({
    type: [CashBoxDTO],
    description: 'Company cash boxes (اذا مافي شركة)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CashBoxDTO)
  @IsOptional()
  cashBoxes?: CashBoxDTO[];

  @ApiPropertyOptional({
    type: [OnlinePaymentMethodDTO],
    description: 'Accepted online payment methods (اذا مافي شركة)',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnlinePaymentMethodDTO)
  @IsOptional()
  onlinePaymentMethods?: OnlinePaymentMethodDTO[];

  @ApiPropertyOptional({
    type: [InsuranceCompanyDTO],
    description: 'Accepted insurance companies (اذا مافي شركة)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsuranceCompanyDTO)
  @IsOptional()
  insuranceCompany?: InsuranceCompanyDTO[];

  @ApiPropertyOptional({
    type: CommercialRecordDTO,
    description: 'Commercial record of the clinic  (اذا مافي شركة)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CommercialRecordDTO)
  commercialRecord?: CommercialRecordDTO;

  @ApiPropertyOptional({
    description: 'Google Maps location coordinates  (اذا مافي شركة)',
    example: { x: 24.7136, y: 46.6753 },
  })
  @IsOptional()
  @IsObject()
  locationGoogl?: { x: number; y: number };

  @ApiPropertyOptional({
    description: 'Department ID that the clinic belongs to',
    example: '60f7c7b84f1a2c001c8b4567',
  })
  @IsOptional()
  @IsMongoId()
  departmentId?: Types.ObjectId;

  @ApiProperty({
    description: 'List of specialization IDs associated with the clinic ',
    example: ['60f7c7b84f1a2c001c8b4567', '60f7c7b84f1a2c001c8b4568'],
    required: true,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  specializations: Types.ObjectId[];
}
