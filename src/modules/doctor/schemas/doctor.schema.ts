import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import {WorkingHours} from "../../../common/utlis/helper";

export type DoctorDocument = Doctor & Document;


@Schema({ timestamps: true })
export class Doctor {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;  // اسم الطبيب

    @Prop()
    phone: string;  // رقم هاتف الطبيب

    @Prop({ type: [String], default: [] })
    specialties: string[];  // تخصصات الطبيب

    @Prop({ type: [WorkingHours], default: [] })
    workingHours: WorkingHours[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
