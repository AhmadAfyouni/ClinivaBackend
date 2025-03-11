import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }])],
    controllers: [AppointmentController],
    providers: [AppointmentService],
})
export class AppointmentModule {}
