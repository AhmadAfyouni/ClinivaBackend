import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { ProfileController } from './profile.controller';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { ClinicCollectionModule } from '../cliniccollection/clinic-collection.module';
import { DepartmentModule } from '../department/department.module';
import {
  Department,
  DepartmentSchema,
} from '../department/schemas/department.schema';
import { Role, RoleSchema } from '../role/schemas/role.schema';
import { Clinic, ClinicSchema } from '../clinic/schemas/clinic.schema';
import { ClinicModule } from '../clinic/clinic.module';
import { EmailModule } from './dto/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Clinic.name, schema: ClinicSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    forwardRef(() => ClinicCollectionModule),
    forwardRef(() => DepartmentModule),
    forwardRef(() => ClinicModule),
    EmailModule, // EmailModule is imported here and its providers are available in this module
  ],
  controllers: [EmployeeController, ProfileController],
  providers: [EmployeeService],
  exports: [EmployeeService], // We only need to export EmployeeService as it's the main service of this module
})
export class EmployeeModule {}
