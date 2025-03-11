import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {PermissionsEnum} from "../../../config/permission.enum";

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string; // Role name (Admin, Doctor, Receptionist)

    @Prop({ type: [String], enum: Object.values(PermissionsEnum), default: [] })
    permissions: string[]; // قائمة الصلاحيات المرتبطة بالدور

    @Prop({ type: [String], default: [] })
    permissionGroups: string[]; // قائمة المجموعات التي ينتمي إليها الدور

    @Prop()
    description?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
