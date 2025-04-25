import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';

import { EmployeeModule } from '../employee/employee.module';
import { PatientModule } from '../patient/patient.module';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';
import { Patient, PatientSchema } from '../patient/schemas/patient.schema';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { forwardRef } from '@nestjs/common';
import { Clinic,ClinicSchema } from '../clinic/schemas/clinic.schema';
import { ClinicModule } from '../clinic/clinic.module';
import { Service, ServiceSchema } from '../service/schemas/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: User.name, schema: UserSchema },
      { name: Clinic.name, schema: ClinicSchema },
    ]),
    forwardRef(() => PatientModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => UserModule),
    forwardRef(() => ClinicModule),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService, MongooseModule],
})
export class AppointmentModule {}
