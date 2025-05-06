import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Department is active', example: true, required: false })
  @Prop({ default: true })
  isActive: boolean;
  @ApiProperty({ description: 'Department name', example: 'Cardiology', required: true })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Department description', example: 'Cardiology department', required: false })
    @Prop()
    description?: string;

  @ApiProperty({ description: 'Year of establishment', example: '2020-01-01', required: false })
  @Prop({ type: Date })
  yearOfEstablishment?: Date;

  @ApiProperty({ description: 'Department address', example: '123 Main St, Riyadh', required: true })
    @Prop()
    address: string;

    @ApiProperty({ description: 'Department patient capacity', example: 100, required: true })
    @Prop()
    patientCapacity: number;  // قدرة استيعاب المرضى

    @ApiProperty({ description: 'Department clinic collection ID', example: '60f7c7b84f1a2c001c8b4567', required: true })
  @Prop({ type: Types.ObjectId, ref: 'ClinicCollection', required: true })
  clinicCollectionId: Types.ObjectId;

  @ApiProperty({ description: 'Department required staff', example: ['Dr. Smith', 'Dr. Johnson'], required: true })
  @Prop({ type: [String], default: [] })
  requiredStaff: string[];//  الكادر المطلوب  

  @ApiProperty({ description: 'Department specializations', example: ['Cardiology', 'Dermatology'], required: true })
  @Prop({ type: [Types.ObjectId], ref: 'Specialization', required: true })
  specializations: Types.ObjectId[];  // قائمة بمعرفات الاختصاصات المرتبطة بالقسم
  @ApiProperty({ description: 'Department public ID', example: 'us-123456', required: true })
  @Prop({ unique: true, required: true })
  publicId: string;

  @ApiProperty({ description: 'Department PIC ID', example: '60f7c7b84f1a2c001c8b4567', required: true })
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  PIC: Types.ObjectId;

  @ApiProperty({ description: 'Department deleted', example: false, required: false })
  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
