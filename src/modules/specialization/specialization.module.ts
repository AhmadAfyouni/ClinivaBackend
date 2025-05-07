import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecializationService } from './specialization.service';
import {
  Specialization,
  SpecializationSchema,
} from './schemas/specialization.schema';
import { SpecializationController } from './specialization.controller';
import { Clinic, ClinicSchema } from '../clinic/schemas/clinic.schema';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { EmployeeModule } from '../employee/employee.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Clinic.name, schema: ClinicSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => EmployeeModule),
    forwardRef(() => UserModule),
  ],
  controllers: [SpecializationController],
  providers: [SpecializationService],
  exports: [SpecializationService],
})
export class SpecializationModule {}
