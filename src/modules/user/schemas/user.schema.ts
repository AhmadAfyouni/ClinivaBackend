import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityLog, LoginHistory } from 'src/common/utlis/helper';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // سيضيف createdAt و updatedAt تلقائيًا
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string; // اسم المستخدم

  @Prop({ required: true, unique: true })
  email: string; // البريد الإلكتروني (فريد لعدم التكرار)

  @Prop({ required: true })
  password: string; // كلمة المرور

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Role', required: true })
  roleIds: Types.ObjectId[]; // قائمة بمعرفات الأدوار المرتبطة بالمستخدم

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId; // مرجع إلى جدول الموظفين (إن كان المستخدم موظفًا)

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date;

  @Prop()
  lastPasswordUpdate?: Date; // تاريخ آخر تحديث لكلمة المرور

  @Prop({ type: [ActivityLog], default: [] })
  activityLog?: ActivityLog[]; // سجل النشاط

  @Prop({ type: [LoginHistory], default: [] })
  loginHistory?: LoginHistory[]; // تاريخ ووقت تسجيل الدخول من الأجهزة والعناوين IP
}

export const UserSchema = SchemaFactory.createForClass(User);
