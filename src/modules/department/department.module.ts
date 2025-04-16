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
@Module({
  imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema },
    { name: Clinic.name, schema: ClinicSchema },
    { name: Appointment.name, schema: AppointmentSchema },
    { name: MedicalRecord.name, schema: MedicalRecordSchema },
  ]),ClinicModule,AppointmentModule,MedicalRecordModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {
}
