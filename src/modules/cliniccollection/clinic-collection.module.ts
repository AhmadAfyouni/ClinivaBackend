import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClinicCollectionService } from './clinic-collection.service';
import { ClinicCollectionController } from './clinic-collection.controller';
import {
  ClinicCollection,
  ClinicCollectionSchema,
} from './schemas/cliniccollection.schema';
import { UserModule } from '../user/user.module'; // 👈 Import UserModule
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClinicCollection.name, schema: ClinicCollectionSchema },
    ]),
    UserModule,
    EmployeeModule,
  ],
  controllers: [ClinicCollectionController],
  providers: [ClinicCollectionService],
  exports: [ClinicCollectionService],
})
export class ClinicCollectionModule {}
