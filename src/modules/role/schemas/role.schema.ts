import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string; // Role name (Admin, Doctor, Receptionist)

    @Prop({ type: [String], default: [] })
    permissions: string[]; // List of system permissions "view_patients", "write_prescriptions"

    @Prop()
    description?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
