import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { Clinic, ClinicSchema } from './schemas/clinic.schema';
import { AppointmentSchema } from '../appointment/schemas/appointment.schema';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clinic.name, schema: ClinicSchema }, 
      { name: 'Appointment', schema: AppointmentSchema },
      { name: Employee.name, schema: EmployeeSchema }
    ])
  ],
  controllers: [ClinicController],
  providers: [ClinicService],
  exports: [ClinicService],
})
export class ClinicModule {
}
