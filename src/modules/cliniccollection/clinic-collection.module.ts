import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicCollectionService } from './clinic-collection.service';
import { ClinicCollectionController } from './clinic-collection.controller';
import {
  Complex,
  ClinicCollectionSchema,
} from './schemas/cliniccollection.schema';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { EmployeeModule } from '../employee/employee.module';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';
import { CompanyModule } from '../company/company.module';
import {
  Department,
  DepartmentSchema,
} from '../department/schemas/department.schema';
import { Clinic, ClinicSchema } from '../clinic/schemas/clinic.schema';
import {
  Appointment,
  AppointmentSchema,
} from '../appointment/schemas/appointment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complex.name, schema: ClinicCollectionSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Clinic.name, schema: ClinicSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
    forwardRef(() => EmployeeModule),
    forwardRef(() => CompanyModule), // Use forwardRef for EmployeeModule
  ],
  controllers: [ClinicCollectionController],
  providers: [ClinicCollectionService],
  exports: [ClinicCollectionService],
})
export class ClinicCollectionModule {}
