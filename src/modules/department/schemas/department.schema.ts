import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Department is active',
    example: true,
    required: false,
  })
  @Prop({ default: true })
  isActive: boolean;
  @ApiProperty({
    description: 'Department name',
    example: 'Cardiology',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Department description',
    example: 'Cardiology department',
    required: false,
  })
  @Prop()
  description?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Complex',
    default: null,
  })
  clinicCollectionId: Types.ObjectId;

  @Prop({ unique: true, required: true })
  publicId: string;

  @ApiProperty({
    description: 'Department deleted',
    example: false,
    required: false,
  })
  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
