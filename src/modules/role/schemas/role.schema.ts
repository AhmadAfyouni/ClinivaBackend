import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PermissionsEnum } from '../../../config/permission.enum';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string; // Role name (Admin, Doctor, Receptionist)

  @Prop({
    type: [String],
    enum: Object.values(PermissionsEnum),
    default: [],
    unique: true,
  })
  permissions: string[]; // قائمة الصلاحيات المرتبطة بالدور

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
