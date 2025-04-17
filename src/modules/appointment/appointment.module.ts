import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';

import { EmployeeModule } from '../employee/employee.module';
import { PatientModule } from '../patient/patient.module';
import { Employee,EmployeeSchema } from '../employee/schemas/employee.schema';
import { Patient,PatientSchema } from '../patient/schemas/patient.schema';
import { forwardRef } from '@nestjs/common';
@Module({
  imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema },{ name: Employee.name, schema: EmployeeSchema },
    
     { name: Patient.name, schema: PatientSchema }]),forwardRef(() => PatientModule),forwardRef(() => EmployeeModule)],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService,MongooseModule],
})
export class AppointmentModule {
}
