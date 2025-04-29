import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { Clinic, ClinicSchema } from './schemas/clinic.schema';
import { AppointmentSchema } from '../appointment/schemas/appointment.schema';
import {
  MedicalRecord,
  MedicalRecordSchema,
} from '../medicalrecord/schemas/medicalrecord.schema';
import { MedicalRecordModule } from '../medicalrecord/medical-record.module';
import {
  Specialization,
  SpecializationSchema,
} from '../specialization/schemas/specialization.schema';
import { SpecializationModule } from '../specialization/specialization.module';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';
import { UserModule } from '../user/user.module';
import { UserSchema,User } from '../user/schemas/user.schema';
import { EmployeeModule } from '../employee/employee.module';
import { ServiceModule } from '../service/service.module';
import { Service, ServiceSchema } from '../service/schemas/service.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clinic.name, schema: ClinicSchema },
      { name: 'Appointment', schema: AppointmentSchema },
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: Specialization.name, schema: SpecializationSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: User.name, schema: UserSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
    forwardRef(() => MedicalRecordModule),
    forwardRef(() => SpecializationModule),
    forwardRef(() => UserModule),
    forwardRef(() => EmployeeModule),
    forwardRef(() => ServiceModule),
  ],

  controllers: [ClinicController],
  providers: [ClinicService],
  exports: [ClinicService, MongooseModule],
})
export class ClinicModule {}
