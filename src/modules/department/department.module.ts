import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { ClinicModule } from '../clinic/clinic.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { ClinicSchema,Clinic } from '../clinic/schemas/clinic.schema';
import { AppointmentSchema,Appointment } from '../appointment/schemas/appointment.schema';
import { MedicalRecordModule } from '../medicalrecord/medical-record.module';
import { MedicalRecord,MedicalRecordSchema } from '../medicalrecord/schemas/medicalrecord.schema';
import { ClinicCollectionSchema,ClinicCollection } from '../cliniccollection/schemas/cliniccollection.schema';
import { ClinicCollectionModule } from '../cliniccollection/clinic-collection.module';
import { forwardRef } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { RoleModule } from '../role/role.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema },
    { name: Clinic.name, schema: ClinicSchema },
    { name: ClinicCollection.name, schema: ClinicCollectionSchema },
    { name: Appointment.name, schema: AppointmentSchema },
    { name: MedicalRecord.name, schema: MedicalRecordSchema },
    { name: User.name, schema: UserSchema },
  ]),forwardRef(() => ClinicModule),forwardRef(() => AppointmentModule),forwardRef(() => MedicalRecordModule),forwardRef(() => ClinicCollectionModule),forwardRef(() => UserModule),forwardRef(() => RoleModule),],
  controllers: [DepartmentController],
  providers: [DepartmentService, EmployeeService, UserService],
  exports: [DepartmentService],
})
export class DepartmentModule {
}
