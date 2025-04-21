import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { Clinic, ClinicSchema } from './schemas/clinic.schema';
import { AppointmentSchema } from '../appointment/schemas/appointment.schema';
import {
  MedicalRecord,
  MedicalRecordSchema,
} from '../medicalrecord/schemas/medicalrecord.schema';
import { MedicalRecordModule } from '../medicalrecord/medical-record.module';
import {
  Specialization,
  SpecializationSchema,
} from '../specialization/schemas/specialization.schema';
import { SpecializationModule } from '../specialization/specialization.module';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clinic.name, schema: ClinicSchema },
      { name: 'Appointment', schema: AppointmentSchema },
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    forwardRef(() => MedicalRecordModule),
    forwardRef(() => SpecializationModule),
  ],

  controllers: [ClinicController],
  providers: [ClinicService],
  exports: [ClinicService, MongooseModule],
})
export class ClinicModule {}
