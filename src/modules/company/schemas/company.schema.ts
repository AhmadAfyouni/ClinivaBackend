import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;  // اسم الشركة

    @Prop({ required: true})
    address: string;

    @Prop({ type: [Types.ObjectId], ref: 'ClinicCollection', default: [] })
    clinicCollections: Types.ObjectId[]; // المجموعات المرتبطة بها
}

export const CompanySchema = SchemaFactory.createForClass(Company);
