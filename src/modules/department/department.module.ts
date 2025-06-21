import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { ClinicModule } from '../clinic/clinic.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { ClinicSchema, Clinic } from '../clinic/schemas/clinic.schema';
import {
  AppointmentSchema,
  Appointment,
} from '../appointment/schemas/appointment.schema';
import { MedicalRecordModule } from '../medicalrecord/medical-record.module';
import {
  MedicalRecord,
  MedicalRecordSchema,
} from '../medicalrecord/schemas/medicalrecord.schema';
import {
  ClinicCollectionSchema,
  Complex,
} from '../cliniccollection/schemas/cliniccollection.schema';
import { ClinicCollectionModule } from '../cliniccollection/clinic-collection.module';
import { forwardRef } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { RoleModule } from '../role/role.module';
import { EmployeeModule } from '../employee/employee.module';
import { EmailModule } from '../employee/dto/email.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Clinic.name, schema: ClinicSchema },
      { name: Complex.name, schema: ClinicCollectionSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
    ]),
    forwardRef(() => ClinicModule),
    forwardRef(() => AppointmentModule),
    forwardRef(() => MedicalRecordModule),
    forwardRef(() => ClinicCollectionModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => RoleModule),
    EmailModule,
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
