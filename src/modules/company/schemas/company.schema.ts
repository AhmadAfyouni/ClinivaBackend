import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { BaseEntity } from 'src/inheritance/entity/schemas/entity.schema';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company extends BaseEntity {
  _id: Types.ObjectId;
  @Prop({ type: [Types.ObjectId], ref: 'ClinicCollection', default: [] })
  clinicCollections: Types.ObjectId[]; // المجموعات المرتبطة بها
}

export const CompanySchema = SchemaFactory.createForClass(Company);
