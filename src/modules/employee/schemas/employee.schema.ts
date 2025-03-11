import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type EmployeeDocument = Employee & Document;

class TimeSlot {
    @Prop({ required: true })
    startTime: string; // وقت بدء العمل (مثال: "04:00 PM")

    @Prop({ required: true })
    endTime: string; // وقت انتهاء العمل (مثال: "08:00 PM")
}

class WorkingHours {
    @Prop({ required: true, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] })
    day: string; // اليوم

    @Prop({ type: [TimeSlot], default: [] })
    timeSlots: TimeSlot[]; // قائمة الفترات الزمنية لكل يوم
}

@Schema({ timestamps: true })
export class Employee {
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
