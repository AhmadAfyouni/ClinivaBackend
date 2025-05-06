import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type SystemLogDocument = SystemLog & Document;

export enum SystemLogAction {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT', // Example for future use
  USER_PROFILE_UPDATE = 'USER_PROFILE_UPDATE',
  // Add other relevant actions as your application evolves
  // e.g., ITEM_CREATED, ITEM_DELETED, PAYMENT_SUCCESS, etc.
}

@Schema({ timestamps: { createdAt: 'timestamp' } }) // Renames createdAt to timestamp
export class SystemLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: SystemLogAction, required: true, index: true })
  action: SystemLogAction;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed }) // For any additional JSON details
  details?: any;

  // 'timestamp' field will be automatically created and managed by Mongoose
  // due to the schema options: timestamps: { createdAt: 'timestamp' }
}

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog);

// If you anticipate very high write loads or specific query patterns,
// you might consider more specific compound indexes here.
// For now, individual indexes on userId and action should be a good start.