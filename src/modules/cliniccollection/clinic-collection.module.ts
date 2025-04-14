import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicCollectionService } from './clinic-collection.service';
import { ClinicCollectionController } from './clinic-collection.controller';
import {
  ClinicCollection,
  ClinicCollectionSchema,
} from './schemas/cliniccollection.schema';
import { UserModule } from '../user/user.module';
import { EmployeeModule } from '../employee/employee.module';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';
import { Department, DepartmentSchema } from '../department/schemas/department.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClinicCollection.name, schema: ClinicCollectionSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
    UserModule,
    EmployeeModule,
  ],
  controllers: [ClinicCollectionController],
  providers: [ClinicCollectionService],
  exports: [ClinicCollectionService],
})
export class ClinicCollectionModule {}
