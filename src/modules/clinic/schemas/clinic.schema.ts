import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Schema as MongooseSchema, Types} from 'mongoose';

export type ClinicDocument = Clinic & Document;

@Schema({ timestamps: true })
export class Clinic {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;  // اسم العيادة

    @Prop({ required: true })
    address: string; // عنوان العيادة

    @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
    departmentId?: Types.ObjectId;  // القسم الذي تتبع له العيادة (إذا وجدت)

}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);
