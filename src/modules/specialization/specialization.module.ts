import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecializationService } from './specialization.service';
import { Specialization, SpecializationSchema } from './schemas/specialization.schema';
import { SpecializationController,  } from './specialization.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Specialization.name, schema: SpecializationSchema }]),
  ],
  controllers: [SpecializationController],
  providers: [SpecializationService],
  exports:[SpecializationService]
})
export class SpecializationModule {}
