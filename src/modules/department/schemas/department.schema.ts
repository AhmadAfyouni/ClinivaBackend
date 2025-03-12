import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { BaseEntity } from 'src/inheritance/entity/schemas/entity.schema';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department extends BaseEntity {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ClinicCollection', required: true })
  clinicCollectionId: Types.ObjectId; // مجموعة العيادات التي ينتمي إليها القسم

  @Prop({ type: [Types.ObjectId], ref: 'Clinic', default: [] })
  clinics: Types.ObjectId[]; // العيادات التي تتبع هذا القسم
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
