import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { AppointmentModule } from '../appointment/appointment.module';
import { MedicalRecordModule } from '../medicalrecord/medical-record.module';
import { EmployeeModule } from '../employee/employee.module';
import { AppointmentSchema,Appointment } from '../appointment/schemas/appointment.schema';
import { EmployeeSchema,Employee } from '../employee/schemas/employee.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema },
    { name: Appointment.name, schema: AppointmentSchema }, // إذا كنت تستخدم AppointmentModel هنا
    { name: Employee.name, schema: EmployeeSchema },
  ]),AppointmentModule,MedicalRecordModule,EmployeeModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService], // يمكن استخدامها في وحدات أخرى
})
export class PatientModule {
}
