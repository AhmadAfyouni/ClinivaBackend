import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Patient ID (MongoDB ObjectId)',
    example: '60f7c7b84f1a2c001c8b4567',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  patient: Types.ObjectId;

  @ApiProperty({
    description: 'Clinic ID (MongoDB ObjectId)',
    example: '60f7c7b84f1a2c001c8b1234',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  clinic: Types.ObjectId;

    @ApiProperty({
        description: 'Doctor ID (MongoDB ObjectId) - The doctor is an employee',
        example: '60f7c7b84f1a2c001c8b7890',
        required: false
    })
    @IsOptional()
    @IsMongoId()
    doctor?: Types.ObjectId;

  @ApiProperty({
    description: 'Scheduled appointment datetime',
    example: '2025-03-20T10:30:00Z',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  datetime: Date;


  @ApiProperty({
    description: 'Reason for the visit',
    example: 'Routine check-up',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Appointment status',
    enum: ['scheduled', 'completed', 'cancelled'],
    example: 'scheduled',
    required: false,
  })
  @IsOptional()
  @IsEnum(['scheduled', 'completed', 'cancelled'])
  status?: string;

 
    @ApiProperty({
        description: 'سبب إلغاء الحجز',
        example: 'المريض غير قادر على الحضور',
        required: false,
      })
      @IsOptional()
      @IsString()
      cancellationReason?: string;  // سبب إلغاء الحجز
}
