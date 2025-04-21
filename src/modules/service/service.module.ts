import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './schemas/service.schema';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { Clinic, ClinicSchema } from '../clinic/schemas/clinic.schema';
import { ClinicCollection, ClinicCollectionSchema } from '../cliniccollection/schemas/cliniccollection.schema';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Service', schema: ServiceSchema },
      { name: 'Clinic', schema: ClinicSchema },
      { name: 'ClinicCollection', schema: ClinicCollectionSchema },
      { name: 'Employee', schema: EmployeeSchema },
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
