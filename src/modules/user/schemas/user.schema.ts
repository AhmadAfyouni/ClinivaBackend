import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityLog, LoginHistory } from 'src/common/utlis/helper';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Role', required: true })
  roleIds: Types.ObjectId[];

  @Prop({
    type: String,
    enum: [
      'Doctor',
      'Nurse',
      'Technician',
      'Administrative',
      'Employee',
      'PIC',
      'Other',
    ],
    required: true,
  })
  employeeType: string;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date;

  @Prop()
  lastPasswordUpdate?: Date;

  @Prop({ type: [ActivityLog], default: [] })
  activityLog?: ActivityLog[];

  @Prop({ type: [LoginHistory], default: [] })
  loginHistory?: LoginHistory[];

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({
    required: true,
    default: 'clinic',
    enum: ['company', 'complex', 'clinic'],
  })
  plan: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Complex', required: true })
  complexId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Clinic', required: true })
  clinicId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
