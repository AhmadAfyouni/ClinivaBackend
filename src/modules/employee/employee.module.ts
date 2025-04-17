import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { ClinicCollectionModule } from '../cliniccollection/clinic-collection.module';
import { ClinicCollectionSchema,ClinicCollection } from '../cliniccollection/schemas/cliniccollection.schema';
import { DepartmentModule } from '../department/department.module';
import { Department,DepartmentSchema } from '../department/schemas/department.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: ClinicCollection.name, schema: ClinicCollectionSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),ClinicCollectionModule,DepartmentModule
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService], // تصدير الخدمة لاستخدامها في وحدات أخرى إذا لزم الأمر
})
export class EmployeeModule {}
