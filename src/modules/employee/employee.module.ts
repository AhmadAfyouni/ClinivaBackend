import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { ProfileController } from './profile.controller';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { ClinicCollectionModule } from '../cliniccollection/clinic-collection.module';
import {
  ClinicCollectionSchema,
  Complex,
} from '../cliniccollection/schemas/cliniccollection.schema';
import { DepartmentModule } from '../department/department.module';
import {
  Department,
  DepartmentSchema,
} from '../department/schemas/department.schema';
import { forwardRef } from '@nestjs/common';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Complex.name, schema: ClinicCollectionSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
    forwardRef(() => ClinicCollectionModule),
    forwardRef(() => DepartmentModule),
  ],
  controllers: [EmployeeController, ProfileController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
