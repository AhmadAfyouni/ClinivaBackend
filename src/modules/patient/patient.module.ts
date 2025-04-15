import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { AppointmentModule } from '../appointment/appointment.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),AppointmentModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService], // يمكن استخدامها في وحدات أخرى
})
export class PatientModule {
}
