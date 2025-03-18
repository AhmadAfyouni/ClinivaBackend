import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMedicalRecordDto {
    @ApiProperty({
        description: 'Appointment ID linked to the medical record',
        example: '60f7c7b84f1a2c001c8b4567',
        required: true
    })
    @IsMongoId()
    @IsNotEmpty()
    appointment: Types.ObjectId;

    
    @ApiProperty({
        description: 'Patient symptoms',
        example: 'Fever, Cough, Shortness of breath',
        required: false
      })
      @IsOptional()
      @IsString()
      symptoms?: string;  // الأعراض
    
      @ApiProperty({
        description: 'Treatment plan prescribed by the doctor',
        example: 'Rest, Hydration, Paracetamol 500mg twice a day',
        required: false
      })
      @IsOptional()
      @IsString()
      treatmentPlan?: string;  // خطة العلاج

    @ApiProperty({
        description: 'Medical diagnosis',
        example: 'Acute bronchitis',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    diagnosis: string;

    @ApiProperty({
        type: [String],
        description: 'List of prescribed medications',
        example: ['Paracetamol', 'Ibuprofen'],
        required: false
    })
    @IsArray()
    @IsOptional()
    medications?: string[];

    @ApiProperty({
        type: [String],
        description: 'List of required lab tests',
        example: ['Blood Test', 'X-Ray'],
        required: false
    })
    @IsArray()
    @IsOptional()
    labTests?: string[];

    @ApiProperty({
        description: 'Additional doctor notes',
        example: 'Patient needs follow-up after two weeks',
        required: false
    })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({
        description: 'Record status',
        enum: ['draft', 'finalized'],
        example: 'draft',
        required: false
    })
    @IsEnum(['draft', 'finalized'])
    @IsOptional()
    recordStatus?: string;
}
