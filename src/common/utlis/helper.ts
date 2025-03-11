import {Prop} from "@nestjs/mongoose";

class TimeSlot {
    @Prop({ required: true })
    startTime: string; // وقت بدء العمل (مثال: "04:00 PM")

    @Prop({ required: true })
    endTime: string; // وقت انتهاء العمل (مثال: "08:00 PM")
}

export class WorkingHours {
    @Prop({ required: true, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] })
    day: string; // اليوم

    @Prop({ type: [TimeSlot], default: [] })
    timeSlots: TimeSlot[]; // قائمة الفترات الزمنية لكل يوم
}
