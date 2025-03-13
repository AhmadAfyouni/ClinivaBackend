import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Schema as MongooseSchema, Types} from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;  // اسم القسم (مثال: طب الأسنان، الجراحة العامة)

    @Prop({ type: Types.ObjectId, ref: 'ClinicCollection', required: true })
    clinicCollectionId: Types.ObjectId;  // مجموعة العيادات التي ينتمي إليها القسم

}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
