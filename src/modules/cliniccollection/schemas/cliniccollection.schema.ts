import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Schema as MongooseSchema, Types} from 'mongoose';


export type ClinicCollectionDocument = ClinicCollection & Document;

@Schema({ timestamps: true })
export class ClinicCollection {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;  // اسم مجموعة العيادات

    @Prop({ type: Types.ObjectId, ref: 'Company', default: null })
    companyId?: Types.ObjectId;  // الشركة المالكة للمجموعة (إذا وجدت)

    @Prop({ type: [Types.ObjectId], ref: 'Department', default: [] })
    departments: Types.ObjectId[]; // الأقسام داخل هذه المجموعة
}

export const ClinicCollectionSchema = SchemaFactory.createForClass(ClinicCollection);
