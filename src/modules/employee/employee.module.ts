import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { ClinicCollectionModule } from '../cliniccollection/clinic-collection.module';
import {
  ClinicCollectionSchema,
  ClinicCollection,
} from '../cliniccollection/schemas/cliniccollection.schema';
import { DepartmentModule } from '../department/department.module';
import {
  Department,
  DepartmentSchema,
} from '../department/schemas/department.schema';
import { forwardRef } from '@nestjs/common';
import { User, UserSchema } from '../user/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: ClinicCollection.name, schema: ClinicCollectionSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => ClinicCollectionModule),
    forwardRef(() => DepartmentModule),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
