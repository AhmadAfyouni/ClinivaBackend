import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Ensure Types is imported from mongoose
import { SystemLog, SystemLogAction, SystemLogDocument } from './log_schema';

export interface CreateLogDto {
  userId: Types.ObjectId | string; // Allow string for flexibility, convert to ObjectId in service
  action: SystemLogAction;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

@Injectable()
export class SystemLogService {
  constructor(
    @InjectModel(SystemLog.name)
    private systemLogModel: Model<SystemLogDocument>,
  ) {}

  async createLog(logData: CreateLogDto): Promise<SystemLogDocument> {
    const newLog = new this.systemLogModel({
      ...logData,
      // Ensure userId is stored as ObjectId if a string is passed
      userId:
        typeof logData.userId === 'string'
          ? new Types.ObjectId(logData.userId)
          : logData.userId,
    });
    return newLog.save();
  }

  // Future methods for querying logs can be added here:
  // async findLogsByUserId(userId: string): Promise<SystemLogDocument[]> {
  //   return this.systemLogModel.find({ userId: new Types.ObjectId(userId) }).sort({ timestamp: -1 }).exec();
  // }

  // async findLogsByAction(action: SystemLogAction, limit: number = 50): Promise<SystemLogDocument[]> {
  //   return this.systemLogModel.find({ action }).sort({ timestamp: -1 }).limit(limit).exec();
  // }
}
