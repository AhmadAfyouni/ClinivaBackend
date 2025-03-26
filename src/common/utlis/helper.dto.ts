

import { ApiProperty } from '@nestjs/swagger';

export class WorkingHoursDTO {
  @ApiProperty({
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    description: 'Day of the week',
    required: true,
    example: 'Monday'
  })
  day: string;

  @ApiProperty({
    type: String,
    description: 'Work start time (e.g., "04:00 PM")',
    required: true,
    example: '08:00 AM'
  })
  startTime: string;

  @ApiProperty({
    type: String,
    description: 'Work end time (e.g., "08:00 PM")',
    required: true,
    example: '05:00 PM'
  })
  endTime: string;
}

export class InsuranceCompanyDTO {
  @ApiProperty({
    type: String,
    description: 'Name of the insurance company',
    required: true,
    example: 'National Health Insurance'
  })
  companyName: string;

  @ApiProperty({
    type: [String],
    description: 'Covered services',
    required: true,
    example: ['Dental', 'Surgery', 'Lab Tests']
  })
  coveredServices: string[];

  @ApiProperty({
    type: String,
    description: 'Terms and conditions',
    required: true,
    example: 'Coverage limited to network providers only'
  })
  termsAndConditions: string;

  @ApiProperty({
    type: [String],
    description: 'Coverage details (smart list)',
    required: false,
    default: [],
    example: ['Annual limit: $10,000', 'Pre-existing conditions excluded']
  })
  coverageDetails?: string[];

  @ApiProperty({
    type: Number,
    description: 'Coverage percentage %',
    required: true,
    minimum: 0,
    maximum: 100,
    example: 80
  })
  coveragePercentage: number;

  @ApiProperty({
    type: Date,
    description: 'Contract start date',
    required: true,
    example: '2023-01-01T00:00:00Z'
  })
  contractStartDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Contract end date',
    required: true,
    example: '2023-12-31T23:59:59Z'
  })
  contractEndDate: Date;

  @ApiProperty({
    type: String,
    description: 'Contact person',
    required: true,
    example: 'Mr. Ahmed Al-Ghamdi'
  })
  contactPerson: string;

  @ApiProperty({
    type: String,
    description: 'Company phone number',
    required: true,
    example: '+966112345678'
  })
  companyPhone: string;

  @ApiProperty({
    type: String,
    description: 'Company email',
    required: true,
    example: 'info@nationalhealth.com'
  })
  companyEmail: string;

  @ApiProperty({
    type: String,
    description: 'Company address',
    required: false,
    example: '123 King Fahd Road, Riyadh'
  })
  address?: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is the company active',
    required: false,
    default: true
  })
  isActive?: boolean;
}

export class BankAccountDTO {
  @ApiProperty({
    type: String,
    description: 'Account name',
    required: true,
    example: 'Al-Noor Medical Center'
  })
  accountName: string;

  @ApiProperty({
    type: String,
    description: 'SWIFT code',
    required: true,
    example: 'ALBISARI'
  })
  swiftCode: string;

  @ApiProperty({
    type: String,
    description: 'Bank name',
    required: true,
    example: 'Al Rajhi Bank'
  })
  bankName: string;

  @ApiProperty({
    type: String,
    description: 'Bank address',
    required: false,
    example: 'King Abdullah Road, Riyadh'
  })
  bankAddress?: string;

  @ApiProperty({
    type: String,
    description: 'Account number',
    required: true,
    example: 'SA0380000000608010167519'
  })
  accountNumber: string;

  @ApiProperty({
    type: String,
    description: 'Account type (savings, checking, business)',
    required: true,
    example: 'business'
  })
  accountType: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is the account active',
    required: false,
    default: true
  })
  isActive?: boolean;
}

export class CashBoxDTO {
  @ApiProperty({
    type: String,
    description: 'Cash box name',
    required: true,
    example: 'Main Cash Box'
  })
  name: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is the cash box active',
    required: false,
    default: true
  })
  isActive?: boolean;

  @ApiProperty({
    type: String,
    description: 'Location of the cash box',
    required: true,
    example: 'Reception Area'
  })
  location: string;

  @ApiProperty({
    type: String,
    description: 'Currency used',
    required: true,
    example: 'SAR'
  })
  currency: string;

  @ApiProperty({
    type: String,
    description: 'Person in charge (PIC)',
    required: true,
    example: 'Mohammed Ali'
  })
  pic: string;

  @ApiProperty({
    type: Number,
    description: 'Total balance',
    required: false,
    default: 0,
    example: 15000.50
  })
  totalBalance?: number;

  @ApiProperty({
    type: String,
    description: 'Created by user',
    required: false,
    example: 'admin@clinic.com'
  })
  createdBy?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        date: { type: 'string', format: 'date-time', example: '2023-05-20T14:30:00Z' },
        amount: { type: 'number', example: 1500 },
        description: { type: 'string', example: 'Payment for consultation' }
      }
    },
    description: 'Transaction history',
    required: false,
    default: []
  })
  transactionHistory?: { date: Date; amount: number; description: string }[];
}


export class OnlinePaymentMethodDTO {
  @ApiProperty({
    type: String,
    description: 'Payment company name',
    required: true,
    example: 'Stripe Payments'
  })
  companyName: string;

  @ApiProperty({
    enum: ['deposit', 'withdrawal', 'transfer'],
    description: 'Type of transaction',
    required: true,
    example: 'deposit'
  })
  transactionType: string;

  @ApiProperty({
    enum: ['credit_card', 'bank_transfer', 'digital_wallet'],
    description: 'Payment method type',
    required: true,
    example: 'credit_card'
  })
  type: string;

  @ApiProperty({
    type: [String],
    description: 'Supported currencies',
    required: true,
    example: ['SAR', 'USD', 'EUR']
  })
  supportedCurrencies: string[];

  @ApiProperty({
    type: Number,
    description: 'Processing fees percentage',
    required: true,
    minimum: 0,
    example: 2.5
  })
  processingFees: number;

  @ApiProperty({
    type: [String],
    description: 'Security features',
    required: false,
    default: [],
    example: ['3D Secure', 'Tokenization', 'Fraud Detection']
  })
  securityFeatures?: string[];

  @ApiProperty({
    type: Boolean,
    description: 'Is the payment method active',
    required: false,
    default: true
  })
  isActive?: boolean;
}

export class CommercialRecordDTO {
  @ApiProperty({
    type: String,
    description: 'Commercial record number',
    required: true,
    example: 'CR-12345678'
  })
  recordNumber: string;

  @ApiProperty({
    type: Date,
    description: 'Date when the record was granted',
    required: true,
    example: '2020-01-15T00:00:00Z'
  })
  grantDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Date when the record was issued',
    required: true,
    example: '2020-01-20T00:00:00Z'
  })
  issueDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Expiration date of the record',
    required: true,
    example: '2030-01-20T00:00:00Z'
  })
  expirationDate: Date;

  @ApiProperty({
    type: String,
    description: 'Tax identification number',
    required: true,
    example: '310123456700003'
  })
  taxNumber: string;
}

export class HolidayDTO {
  @ApiProperty({
    type: String,
    description: 'Name of the holiday',
    required: true,
    example: 'Eid Al-Fitr'
  })
  name: string;

  @ApiProperty({
    type: Date,
    description: 'Date of the holiday',
    required: true,
    example: '2023-04-21T00:00:00Z'
  })
  date: Date;

  @ApiProperty({
    type: String,
    description: 'Reason for the holiday',
    required: true,
    example: 'Islamic religious holiday marking the end of Ramadan'
  })
  reason: string;
}

export class ContactInfoDTO {
  @ApiProperty({
    enum: ['email', 'phone', 'socialMedia', 'CompanyWebsite'],
    description: 'Type of contact information',
    required: true,
    example: 'phone'
  })
  type: string;

  @ApiProperty({
    type: String,
    description: 'Contact value (phone number, email, etc.)',
    required: true,
    example: '+966501234567'
  })
  value: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is this contact information public',
    required: true,
    example: true
  })
  isPublic: boolean;

  @ApiProperty({
    type: String,
    description: 'Sub-type of contact (work, office, personal)',
    required: false,
    example: 'work'
  })
  subType?: string;
}

export class InsuranceDTO {
  @ApiProperty({
    type: String,
    description: 'Insurance provider name',
    required: true,
    example: 'Tawuniya'
  })
  insuranceProvider: string;

  @ApiProperty({
    type: String,
    description: 'Insurance policy number',
    required: true,
    example: 'TWN-2023-123456'
  })
  insuranceNumber: string;

  @ApiProperty({
    type: Number,
    description: 'Coverage percentage',
    required: true,
    minimum: 0,
    maximum: 100,
    example: 80
  })
  coveragePercentage: number;

  @ApiProperty({
    type: Date,
    description: 'Expiration date of the insurance',
    required: true,
    example: '2023-12-31T23:59:59Z'
  })
  expiryDate: Date;

  @ApiProperty({
    enum: ['private', 'governmental', 'corporate'],
    description: 'Type of insurance',
    required: true,
    example: 'private'
  })
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
  name: DayOfWeek;

  @ApiProperty({
    type: String,
    description: 'Start of working time (HH:MM format)',
    required: true,
    example: '08:00'
  })
  startOfWorkingTime: string;

  @ApiProperty({
    type: String,
    description: 'End of working time (HH:MM format)',
    required: true,
    example: '17:00'
  })
  endOfWorkingTime: string;
}

export class VacationDTO {
  @ApiProperty({
    type: Date,
    description: 'Start date of leave',
    required: true,
    example: '2023-06-01T00:00:00Z'
  })
  leaveStartDate: Date;

  @ApiProperty({
    type: Date,
    description: 'End date of leave',
    required: true,
    example: '2023-06-10T23:59:59Z'
  })
  leaveEndDate: Date;

  @ApiProperty({
    enum: ['Vacation', 'Sick Leave', 'Emergency'],
    description: 'Type of leave',
    required: true,
    example: 'Vacation'
  })
  leaveType: string;

  @ApiProperty({
    enum: ['Approved', 'Pending'],
    description: 'Status of leave request',
    required: true,
    default: 'Pending',
    example: 'Pending'
  })
  status: string;
}

export class MedicationDTO {
  @ApiProperty({
    type: String,
    description: 'Name of medication',
    required: true,
    example: 'Amoxicillin'
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Dosage of medication',
    required: true,
    example: '500mg every 8 hours'
  })
  dosage: string;
}

export class BreakTimeDTO {
  @ApiProperty({
    type: String,
    description: 'Start time of break (HH:MM format)',
    required: true,
    example: '12:00'
  })
  startTime: string;

  @ApiProperty({
    type: String,
    description: 'End time of break (HH:MM format)',
    required: true,
    example: '13:00'
  })
  endTime: string;
}

export class MedicalTestResultDTO {
/*  @ApiProperty({
    type: String,
    description: 'Type of file (PDF, JPEG, DICOM)',
    required: true,
    example: 'PDF'
  })
  fileType: string;*/

  @ApiProperty({
    type: String,
    description: 'Path of uploaded file in system',
    required: true,
    example: '/uploads/tests/patient-12345/blood-test.pdf'
  })
  filePath: string;
/*
  @ApiProperty({
    type: String,
    description: 'Type of medical test',
    required: true,
    example: 'Blood Test'
  })
  testType: string;

  @ApiProperty({
    type: Date,
    description: 'Date when test was conducted',
    required: true,
    example: '2023-05-15T08:30:00Z'
  })
  testDate: Date;

  @ApiProperty({
    type: String,
    description: 'Name of laboratory where test was conducted',
    required: true,
    example: 'National Medical Labs'
  })
  labName: string;*/
}

export class CertificateDTO {
  @ApiProperty({
    type: String,
    description: 'Name of certificate',
    required: true,
    example: 'Board Certification in Cardiology'
  })
  certificateName: string;

  @ApiProperty({
    type: String,
    description: 'Issuing institution',
    required: true,
    example: 'Saudi Commission for Health Specialties'
  })
  institution: string;

  @ApiProperty({
    type: Date,
    description: 'Date when certificate was issued',
    required: true,
    example: '2020-06-15T00:00:00Z'
  })
  issueDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Expiry date of certificate (optional)',
    required: false,
    example: '2025-06-15T00:00:00Z'
  })
  expiryDate?: Date;

  @ApiProperty({
    type: String,
    description: 'URL of stored certificate image',
    required: true,
    example: 'https://storage.example.com/certificates/dr-smith-cardiology-2020.jpg'
  })
  certificateImageUrl: string;

  @ApiProperty({
    enum: ['pending', 'approved', 'rejected'],
    description: 'Verification status of certificate',
    required: true,
    default: 'pending',
    example: 'approved'
  })
  status: string;
}

export class ActivityLogDTO {
  @ApiProperty({
    type: Date,
    description: 'Date when activity occurred',
    required: true,
    example: '2023-08-20T14:30:00Z'
  })
  activityDate: Date;

  @ApiProperty({
    type: String,
    description: 'Description of activity',
    required: true,
    example: 'Updated patient medical record'
  })
  description: string;
}

export class LoginHistoryDTO {
  @ApiProperty({
    type: Date,
    description: 'Date when login occurred',
    required: true,
    example: '2023-05-20T09:15:00Z'
  })
  loginDate: Date;

  @ApiProperty({
    type: String,
    description: 'IP address used for login',
    required: true,
    example: '192.168.1.100'
  })
  ipAddress: string;

  @ApiProperty({
    type: String,
    description: 'Device used for login',
    required: true,
    example: 'iPhone 13, iOS 16.4.1'
  })
  device: string;
}