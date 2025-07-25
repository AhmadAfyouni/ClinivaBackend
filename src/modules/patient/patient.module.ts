import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { AppointmentModule } from '../appointment/appointment.module';
import { MedicalRecordModule } from '../medicalrecord/medical-record.module';
import { EmployeeModule } from '../employee/employee.module';
import {
  AppointmentSchema,
  Appointment,
} from '../appointment/schemas/appointment.schema';
import { EmployeeSchema, Employee } from '../employee/schemas/employee.schema';
import {
  MedicalRecord,
  MedicalRecordSchema,
} from '../medicalrecord/schemas/medicalrecord.schema';
import { forwardRef } from '@nestjs/common';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
    ]),
    forwardRef(() => AppointmentModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => MedicalRecordModule),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
