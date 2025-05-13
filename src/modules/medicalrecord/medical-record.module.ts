import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';
import {
  MedicalRecord,
  MedicalRecordSchema,
} from './schemas/medicalrecord.schema';
import {
  Appointment,
  AppointmentSchema,
} from '../appointment/schemas/appointment.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicalRecord.name, schema: MedicalRecordSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService, MongooseModule, MedicalRecordService],
})
export class MedicalRecordModule {}
