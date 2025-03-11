import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Schema as MongooseSchema, Types} from 'mongoose';
import {WorkingHours} from "../../../common/utlis/helper";

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    phone: string;

    @Prop()
    jobTitle: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', unique: true, default: null })
    user?: MongooseSchema.Types.ObjectId;  // مرجع لحساب المستخدم (اختياري)

    @Prop({ type: [WorkingHours], default: [] })
    workingHours: WorkingHours[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
