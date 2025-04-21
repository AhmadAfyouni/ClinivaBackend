import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecord, MedicalRecordSchema } from './schemas/medicalrecord.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MedicalRecord.name, schema: MedicalRecordSchema }])],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService,MongooseModule], // لتتمكن وحدات أخرى من استخدام هذه الخدمة
})
export class MedicalRecordModule {
}
