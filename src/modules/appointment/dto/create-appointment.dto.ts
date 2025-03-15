import {IsDate, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from 'class-validator';
import {Types} from 'mongoose';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsMongoId()
    patient: Types.ObjectId; // معرف المريض

    @IsNotEmpty()
    @IsMongoId()
    clinic: Types.ObjectId; // معرف العيادة

    @IsNotEmpty()
    @IsMongoId()
    doctor: Types.ObjectId; // doctor is  employee

    @IsNotEmpty()

    datetime: Date; // تاريخ ووقت الموعد المحدد للحجز

    @IsOptional()
    @IsDate()
    startTime?: Date; // وقت بدء الموعد الفعلي

    @IsOptional()
    @IsDate()
    endTime?: Date; // وقت انتهاء الموعد الفعلي

    @IsOptional()
    @IsString()
    reason?: string; // سبب الزيارة

    @IsOptional()
    @IsEnum(['scheduled', 'completed', 'cancelled'])
    status?: string; // حالة الموعد (افتراضي: "scheduled")

    @IsOptional()
    @IsMongoId()
    medicalRecord?: Types.ObjectId; // مرجع إلى السجل الطبي

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    patientRating?: number; // تقييم المريض للطبيب (1-5)

    @IsOptional()
    @IsString()
    patientFeedback?: string; // ملاحظات المريض عن الخدمة
}
