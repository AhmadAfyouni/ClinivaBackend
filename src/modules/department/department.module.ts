import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { ClinicModule } from '../clinic/clinic.module';
import { AppointmentModule } from '../appointment/appointment.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }]),ClinicModule,AppointmentModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {
}
