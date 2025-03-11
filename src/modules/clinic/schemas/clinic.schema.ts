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

    @Prop({ type: Types.ObjectId, ref: 'ClinicCollection', default: null })
    clinicCollectionId?: Types.ObjectId;  // المجموعة التي تنتمي إليها العيادة (إذا وجدت)

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    staff: Types.ObjectId[]; // الموظفون والأطباء العاملون في هذه العيادة
}

export const ClinicSchema = SchemaFactory.createForClass(Clinic);
