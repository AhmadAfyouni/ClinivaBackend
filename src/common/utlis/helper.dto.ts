

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { Type } from 'class-transformer';


export class WorkingHoursDTO {
  @ApiProperty({
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    description: 'The day of work',
    example: 'Monday',
    required: true,
  })
  @IsEnum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
  @IsNotEmpty()
  day: string;

  @ApiProperty({ example: '2024-03-23T08:00:00Z', description: 'Start time in ISO 8601 format', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({ example: '2024-03-23T17:00:00Z', description: 'End time in ISO 8601 format', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endTime: Date;
}
export class InsuranceCompanyDTO {
  @ApiProperty({ example: 'National Health Insurance', description: 'Insurance company name', required: true })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: ['Dental', 'Surgery', 'Lab Tests'], description: 'Covered services', required: true })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  coveredServices: string[];

  @ApiProperty({ example: 'Coverage includes only in-network hospitals', description: 'Terms and conditions', required: true })
  @IsString()
  @IsNotEmpty()
  termsAndConditions: string;

  @ApiProperty({ example: ['Annual limit: $10,000', 'Chronic diseases not covered'], required: false, description: 'Coverage details' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  coverageDetails?: string[];

  @ApiProperty({ example: 80, minimum: 0, maximum: 100, description: 'Coverage percentage', required: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  coveragePercentage: number;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Contract start date', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  contractStartDate: Date;

  @ApiProperty({ example: '2023-12-31T23:59:59Z', description: 'Contract end date', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  contractEndDate: Date;

  @ApiProperty({ example: 'Mr. John Doe', description: 'Contact person name', required: true })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({ example: '+1234567890', description: 'Company phone number', required: true })
  @IsString()
  @IsNotEmpty()
  companyPhone: string;

  @ApiProperty({ example: 'info@insurance.com', description: 'Company email', required: true })
  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;

  @ApiProperty({ example: '123 Main St, City, Country', required: false, description: 'Company address' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: true, required: false, description: 'Company active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
export class BankAccountDTO {
  @ApiProperty({ example: 'John Doe Account', description: 'Bank account name', required: true })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ example: 'ALBISARI', description: 'SWIFT Code', required: true })
  @IsString()
  @IsNotEmpty()
  swiftCode: string;

  @ApiProperty({ example: 'ABC Bank', description: 'Bank name', required: true })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: '123 Bank Street, City', required: false, description: 'Bank address' })
  @IsString()
  @IsOptional()
  bankAddress?: string;

  @ApiProperty({ example: 'SA0380000000608010167519', description: 'Bank account number', required: true })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ example: 'business', description: 'Account type', required: true })
  @IsString()
  @IsNotEmpty()
  accountType: string;

  @ApiProperty({ example: true, required: false, description: 'Account active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}







class TransactionHistoryDTO {
  @ApiProperty({ example: '2024-03-23T10:30:00Z', description: 'Transaction date', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: 1000, description: 'Transaction amount', required: true })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'Deposit for operations', description: 'Transaction description', required: true })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CashBoxDTO {
  @ApiProperty({ example: 'Main Cashbox', description: 'Cashbox name', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: true, required: false, description: 'Cashbox active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 'Head Office', description: 'Cashbox location', required: true })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'USD', description: 'Currency used in cashbox', required: true })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'John Smith', description: 'Person in charge (PIC)', required: true })
  @IsString()
  @IsNotEmpty()
  pic: string;

  @ApiProperty({ example: 5000, required: false, description: 'Total cashbox balance' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalBalance?: number;

  @ApiProperty({ example: 'admin123', required: false, description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({ type: [TransactionHistoryDTO], required: false, description: 'Transaction history' })
  @IsArray()
  @IsOptional()
  transactionHistory?: TransactionHistoryDTO[];
}





export class OnlinePaymentMethodDTO {
  @ApiProperty({ example: 'Stripe Payments', description: 'Payment company name', required: true })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'deposit', enum: ['deposit', 'withdrawal', 'transfer'], description: 'Type of transaction', required: true })
  @IsEnum(['deposit', 'withdrawal', 'transfer'])
  @IsNotEmpty()
  transactionType: string;

  @ApiProperty({ example: 'credit_card', enum: ['credit_card', 'bank_transfer', 'digital_wallet'], description: 'Payment method type', required: true })
  @IsEnum(['credit_card', 'bank_transfer', 'digital_wallet'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: ['SAR', 'USD', 'EUR'], description: 'Supported currencies', required: true })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  supportedCurrencies: string[];

  @ApiProperty({ example: 2.5, description: 'Processing fees percentage', required: true, minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  processingFees: number;

  @ApiProperty({ example: ['3D Secure', 'Tokenization'], required: false, description: 'Security features' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  securityFeatures?: string[];

  @ApiProperty({ example: true, required: false, description: 'Is the payment method active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CommercialRecordDTO {
  @ApiProperty({ example: 'CR-12345678', description: 'Commercial record number', required: true })
  @IsString()
  @IsNotEmpty()
  recordNumber: string;

  @ApiProperty({ example: '2020-01-15T00:00:00Z', description: 'Date when the record was granted', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  grantDate: Date;

  @ApiProperty({ example: '2020-01-20T00:00:00Z', description: 'Date when the record was issued', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  issueDate: Date;

  @ApiProperty({ example: '2030-01-20T00:00:00Z', description: 'Expiration date of the record', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  expirationDate: Date;

  @ApiProperty({ example: '310123456700003', description: 'Tax identification number', required: true })
  @IsString()
  @IsNotEmpty()
  taxNumber: string;
}

export class HolidayDTO {
  @ApiProperty({ example: 'Eid Al-Fitr', description: 'Name of the holiday', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2023-04-21T00:00:00Z', description: 'Date of the holiday', required: true })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ example: 'Islamic religious holiday marking the end of Ramadan', description: 'Reason for the holiday', required: true })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ContactInfoDTO {
  @ApiProperty({ example: 'phone', enum: ['email', 'phone', 'socialMedia', 'CompanyWebsite'], description: 'Type of contact information', required: true })
  @IsEnum(['email', 'phone', 'socialMedia', 'CompanyWebsite'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '+966501234567', description: 'Contact value (phone number, email, etc.)', required: true })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: true, description: 'Is this contact information public', required: true })
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @ApiProperty({ example: 'work', required: false, description: 'Sub-type of contact (work, office, personal)' })
  @IsString()
  @IsOptional()
  subType?: string;
}

export class InsuranceDTO {
  @ApiProperty({
    type: String,
    description: 'Insurance provider name',
    required: true,
    example: 'Tawuniya'
  })
  @IsString()
  @IsNotEmpty()
  insuranceProvider: string;

  @ApiProperty({
    type: String,
    description: 'Insurance policy number',
    required: true,
    example: 'TWN-2023-123456'
  })
  @IsString()
  @IsNotEmpty()
  insuranceNumber: string;

  @ApiProperty({
    type: Number,
    description: 'Coverage percentage',
    required: true,
    minimum: 0,
    maximum: 100,
    example: 80
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  coveragePercentage: number;

  @ApiProperty({
    type: Date,
    description: 'Expiration date of the insurance',
    required: true,
    example: '2023-12-31T23:59:59Z'
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  expiryDate: Date;

  @ApiProperty({
    enum: ['private', 'governmental', 'corporate'],
    description: 'Type of insurance',
    required: true,
    example: 'private'
  })
  @IsEnum(['private', 'governmental', 'corporate'])
  @IsNotEmpty()
  insuranceType: string;
}




export enum DayOfWeek {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}

export class WorkingDaysDTO {
  @ApiProperty({
    enum: DayOfWeek,
    description: 'Day of the week',
    required: true,
    example: DayOfWeek.Monday
  })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  name: DayOfWeek;

  @ApiProperty({
    type: String,
    description: 'Start of working time (HH:MM format)',
    required: true,
    example: '08:00'
  })
  @IsString()
  @IsNotEmpty()
  startOfWorkingTime: string;

  @ApiProperty({
    type: String,
    description: 'End of working time (HH:MM format)',
    required: true,
    example: '17:00'
  })
  @IsString()
  @IsNotEmpty()
  endOfWorkingTime: string;
}

export class VacationDTO {
  @ApiProperty({
    type: Date,
    description: 'Start date of leave',
    required: true,
    example: '2023-06-01T00:00:00Z'
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  leaveStartDate: Date;

  @ApiProperty({
    type: Date,
    description: 'End date of leave',
    required: true,
    example: '2023-06-10T23:59:59Z'
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  leaveEndDate: Date;

  @ApiProperty({
    enum: ['Vacation', 'Sick Leave', 'Emergency'],
    description: 'Type of leave',
    required: true,
    example: 'Vacation'
  })
  @IsEnum(['Vacation', 'Sick Leave', 'Emergency'])
  @IsNotEmpty()
  leaveType: string;

  @ApiProperty({
    enum: ['Approved', 'Pending'],
    description: 'Status of leave request',
    required: true,
    default: 'Pending',
    example: 'Pending'
  })
  @IsEnum(['Approved', 'Pending'])
  @IsNotEmpty()
  status: string;
}

export class MedicationDTO {
  @ApiProperty({
    type: String,
    description: 'Name of medication',
    required: true,
    example: 'Amoxicillin'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Dosage of medication',
    required: true,
    example: '500mg every 8 hours'
  })
  @IsString()
  @IsNotEmpty()
  dosage: string;
}

export class BreakTimeDTO {
  @ApiProperty({
    type: String,
    description: 'Start time of break (HH:MM format)',
    required: true,
    example: '12:00'
  })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    type: String,
    description: 'End time of break (HH:MM format)',
    required: true,
    example: '13:00'
  })
  @IsString()
  @IsNotEmpty()
  endTime: string;
}

export class MedicalTestResultDTO {
  @ApiProperty({
    type: String,
    description: 'Type of file (PDF, JPEG, DICOM)',
    required: false,
    example: 'PDF'
  })
  @IsString()
  @IsNotEmpty()
  fileType?: string;

  @ApiProperty({
    type: String,
    description: 'Path of uploaded file in system',
    required: true,
    example: '/uploads/tests/patient-12345/blood-test.pdf'
  })
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @ApiProperty({
    type: String,
    description: 'Type of medical test',
    required: true,
    example: 'Blood Test'
  })
  @IsString()
  @IsNotEmpty()
  testType: string;

  @ApiProperty({
    type: Date,
    description: 'Date when test was conducted',
    required: true,
    example: '2023-05-15T08:30:00Z'
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  testDate: Date;

  @ApiProperty({
    type: String,
    description: 'Name of laboratory where test was conducted',
    required: true,
    example: 'National Medical Labs'
  })
  @IsString()
  @IsNotEmpty()
  labName: string;
}

export class CertificateDTO {
  @ApiProperty({
    type: String,
    description: 'Name of certificate',
    required: true,
    example: 'Board Certification in Cardiology'
  })
  @IsString()
  certificateName: string;

  @ApiProperty({
    type: String,
    description: 'Issuing institution',
    required: true,
    example: 'Saudi Commission for Health Specialties'
  })
  @IsString()
  institution: string;

  @ApiProperty({
    type: Date,
    description: 'Date when certificate was issued',
    required: true,
    example: '2020-06-15T00:00:00Z'
  })
  @IsDate()
  @Type(() => Date)
  issueDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Expiry date of certificate (optional)',
    required: false,
    example: '2025-06-15T00:00:00Z'
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @ApiProperty({
    type: String,
    description: 'URL of stored certificate image',
    required: true,
    example: 'https://storage.example.com/certificates/dr-smith-cardiology-2020.jpg'
  })
  @IsString()
  certificateImageUrl: string;

  @ApiProperty({
    enum: ['pending', 'approved', 'rejected'],
    description: 'Verification status of certificate',
    required: true,
    default: 'pending',
    example: 'approved'
  })
  @IsString()
  status: string;
}

export class ActivityLogDTO {
  @ApiProperty({
    type: Date,
    description: 'Date when activity occurred',
    required: true,
    example: '2023-08-20T14:30:00Z'
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  activityDate: Date;

  @ApiProperty({
    type: String,
    description: 'Description of activity',
    required: true,
    example: 'Updated patient medical record'
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class LoginHistoryDTO {
  @ApiProperty({
    type: Date,
    description: 'Date when login occurred',
    required: true,
    example: '2023-05-20T09:15:00Z'
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  loginDate: Date;

  @ApiProperty({
    type: String,
    description: 'IP address used for login',
    required: true,
    example: '192.168.1.100'
  })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({
    type: String,
    description: 'Device used for login',
    required: true,
    example: 'iPhone 13, iOS 16.4.1'
  })
  @IsString()
  @IsNotEmpty()
  device: string;
} 

export class StatusEntryDTO {
  @ApiProperty({
    description: 'Status of the entity',
    enum: ['active', 'inactive'],
    example: 'active',
    required: true,
  })
  @IsEnum(['active', 'inactive'])
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Timestamp when the status was changed',
    example: '2025-04-01T10:30:00.000Z',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  changedAt: Date;
}