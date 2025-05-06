import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLog, SystemLogSchema } from './log_schema';
import { SystemLogService } from './system-log.service';
// We will add SystemLogController here soon
// import { SystemLogController } from './system-log.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SystemLog.name, schema: SystemLogSchema }]),
  ],
  providers: [SystemLogService],
  exports: [SystemLogService], 
//   controllers: [SystemLogController], // Will be uncommented when the controller is ready
})
export class SystemLogModule {}