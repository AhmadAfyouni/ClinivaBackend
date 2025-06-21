import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
  IsObject,
  isString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DayOfWeek {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
}

// Base class for common properties with both schema and DTO decorators
export class BaseModel {
  @Prop({ type: Date, default: Date.now })
  @ApiProperty({ type: Date, description: 'Creation date' })
  @IsOptional()
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  @ApiProperty({ type: Date, description: 'Last update date' })
  @IsOptional()
  updatedAt?: Date;
}

// Base Shift class
export class ShiftBase extends BaseModel {
  @Prop({ required: true })
  @ApiProperty({ type: String, required: true, example: '09:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @Prop({ required: true })
  @ApiProperty({ type: String, required: true, example: '17:00' })
  @IsString()
  @IsNotEmpty()
  endTime: string;
}

// Base WorkingHours class
export class WorkingHoursBase extends BaseModel {
  @Prop({ required: true, enum: DayOfWeek })
  @ApiProperty({ enum: DayOfWeek, required: true, example: DayOfWeek.Monday })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  day: DayOfWeek;

  @Prop({ type: ShiftBase, default: { startTime: '08:00', endTime: '13:00' } })
  @ApiProperty({ type: ShiftBase, required: true })
  @ValidateNested()
  @Type(() => ShiftBase)
  shift1: ShiftBase;

  @Prop({ type: ShiftBase, default: { startTime: '14:00', endTime: '19:00' } })
  @ApiProperty({ type: ShiftBase, required: true })
  @ValidateNested()
  @Type(() => ShiftBase)
  shift2: ShiftBase;
}

// Base ContactInfo class
export class ContactInfoBase extends BaseModel {
  @Prop({ type: String })
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  phone_numbers?: string;

  @Prop({ type: String })
  @ApiProperty({ type: String, format: 'email', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @Prop({ type: String })
  @ApiProperty({ type: String, format: 'url', required: false })
  @IsString()
  @IsOptional()
  webSite: string;

  @Prop({ type: String })
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  buildingNumber: string;

  @Prop({ type: String })
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  streetName: string;

  @Prop({ type: String })
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  region: string;

  @Prop({ type: String })
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  country: string;

  @Prop({ type: String })
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  nation: string;

  @Prop({ type: Object })
  @ApiProperty({ type: Object, required: false })
  @IsObject()
  @IsOptional()
  locationGoogl?: { x: number; y: number };

  @Prop({ type: String })
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  emergencyContactName: string;

  @Prop({ type: String })
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  emergencyContactPhone: string;
}

// Base Vacation class
export class VacationBase extends BaseModel {
  @Prop({ required: true, type: Date })
  @ApiProperty({ type: Date, required: true })
  @IsDateString()
  @IsNotEmpty()
  leaveStartDate: Date;

  @Prop({ required: true, type: Date })
  @ApiProperty({ type: Date, required: true })
  @IsDateString()
  @IsNotEmpty()
  leaveEndDate: Date;

  @Prop({ required: true, enum: ['Vacation', 'Sick Leave', 'Emergency'] })
  @ApiProperty({
    enum: ['Vacation', 'Sick Leave', 'Emergency'],
    required: true,
    example: 'Vacation',
  })
  @IsString()
  @IsNotEmpty()
  leaveType: string;

  @Prop({ required: true, enum: ['Approved', 'Pending'], default: 'Pending' })
  @ApiProperty({
    enum: ['Approved', 'Pending'],
    required: true,
    default: 'Pending',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

// Add more base classes as needed for other models
