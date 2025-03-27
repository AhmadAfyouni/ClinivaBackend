import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicCollectionService } from './clinic-collection.service';
import { ClinicCollectionController } from './clinic-collection.controller';
import { ClinicCollection, ClinicCollectionSchema } from './schemas/cliniccollection.schema';
import { DepartmentModule } from '../department/department.module';
import { EmployeeModule } from '../employee/employee.module';
import { ClinicModule } from '../clinic/clinic.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: ClinicCollection.name, schema: ClinicCollectionSchema }]),DepartmentModule,ClinicModule,EmployeeModule],
  controllers: [ClinicCollectionController],
  providers: [ClinicCollectionService],
  exports: [ClinicCollectionService],
})
export class ClinicCollectionModule {
}
