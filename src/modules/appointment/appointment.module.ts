import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { PatientSchema } from '../patient/schemas/patient.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }, { name: 'Patient', schema: PatientSchema }])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService,MongooseModule],
})
export class AppointmentModule {
}
