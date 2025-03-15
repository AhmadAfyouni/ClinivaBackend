import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Types} from 'mongoose';

export class CreateMedicalRecordDto {
    @ApiProperty({description: 'Appointment ID linked to the medical record', example: '60f7c7b84f1a2c001c8b4567'})
    @IsMongoId()
    @IsNotEmpty()
    appointment: Types.ObjectId;

    @ApiProperty({description: 'Medical diagnosis', example: 'Acute bronchitis'})
    @IsString()
    @IsNotEmpty()
    diagnosis: string;

    @ApiPropertyOptional({
        type: [String],
        description: 'List of prescribed medications',
        example: ['Paracetamol', 'Ibuprofen']
    })
    @IsArray()
    @IsOptional()
    medications?: string[];

    @ApiPropertyOptional({type: [String], description: 'List of required lab tests', example: ['Blood Test', 'X-Ray']})
    @IsArray()
    @IsOptional()
    labTests?: string[];

    @ApiPropertyOptional({description: 'Additional doctor notes', example: 'Patient needs follow-up after two weeks'})
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({description: 'Record status', enum: ['draft', 'finalized'], default: 'draft'})
    @IsEnum(['draft', 'finalized'])
    @IsOptional()
    recordStatus?: string;
}
