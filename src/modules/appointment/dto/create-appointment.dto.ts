import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDate,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateAppointmentDto {
    @ApiProperty({
        description: 'Patient ID (MongoDB ObjectId)',
        example: '60f7c7b84f1a2c001c8b4567',
        required: true
    })
    @IsNotEmpty()
    @IsMongoId()
    patient: Types.ObjectId;

    @ApiProperty({
        description: 'Clinic ID (MongoDB ObjectId)',
        example: '60f7c7b84f1a2c001c8b1234',
        required: true
    })
    @IsNotEmpty()
    @IsMongoId()
    clinic: Types.ObjectId;

    @ApiProperty({
        description: 'Doctor ID (MongoDB ObjectId) - The doctor is an employee',
        example: '60f7c7b84f1a2c001c8b7890',
        required: true
    })
    @IsNotEmpty()
    @IsMongoId()
    doctor: Types.ObjectId;

    @ApiProperty({
        description: 'Scheduled appointment datetime',
        example: '2025-03-20T10:30:00Z',
        required: true
    })
    @IsNotEmpty()
    @IsDate()
    datetime: Date;

    @ApiProperty({
        description: 'Actual start time of the appointment',
        example: '2025-03-20T10:45:00Z',
        required: false
    })
    @IsOptional()
    @IsDate()
    startTime?: Date;

    @ApiProperty({
        description: 'Actual end time of the appointment',
        example: '2025-03-20T11:15:00Z',
        required: false
    })
    @IsOptional()
    @IsDate()
    endTime?: Date;

    @ApiProperty({
        description: 'Reason for the visit',
        example: 'Routine check-up',
        required: false
    })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiProperty({
        description: 'Appointment status',
        enum: ['scheduled', 'completed', 'cancelled'],
        example: 'scheduled',
        required: false
    })
    @IsOptional()
    @IsEnum(['scheduled', 'completed', 'cancelled'])
    status?: string;

/*    @ApiProperty({
        description: 'Reference to the patient’s medical record (MongoDB ObjectId)',
        example: '60f7c7b84f1a2c001c8b5555',
        required: false
    })
    @IsOptional()
    @IsMongoId()
    medicalRecord?: Types.ObjectId;
*/
    @ApiProperty({
        description: 'Patient rating for the doctor (1-5)',
        example: 4,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    patientRating?: number;

    @ApiProperty({
        description: 'Patient feedback on the service',
        example: 'The doctor was very professional and helpful.',
        required: false
    })
    @IsOptional()
    @IsString()
    patientFeedback?: string;
}
