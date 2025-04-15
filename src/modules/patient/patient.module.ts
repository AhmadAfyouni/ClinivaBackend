import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { AppointmentModule } from '../appointment/appointment.module';
import { MedicalRecordModule } from '../medicalrecord/medical-record.module';
import { EmployeeModule } from '../employee/employee.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),AppointmentModule,MedicalRecordModule,EmployeeModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService,MongooseModule], // يمكن استخدامها في وحدات أخرى
})
export class PatientModule {
}
