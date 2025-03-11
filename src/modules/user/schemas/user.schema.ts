import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Schema as MongooseSchema, Types} from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // سيضيف createdAt و updatedAt تلقائيًا
export class User {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string;  // اسم المستخدم

    @Prop({ required: true, unique: true })
    email: string;  // البريد الإلكتروني (فريد لعدم التكرار)

    @Prop({ required: true })
    password: string;  // كلمة المرور

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'Role', required: true })
    roleIds: Types.ObjectId[];  // قائمة بمعرفات الأدوار المرتبطة بالمستخدم

    @Prop({ type: Types.ObjectId, ref: 'Company', default: null })
    companyId?: Types.ObjectId;  // الشركة التي يعمل بها الموظف (إن وجد)

    @Prop({ type: Types.ObjectId, ref: 'ClinicCollection', default: null })
    clinicCollectionId?: Types.ObjectId;  // مجموعة العيادات التي يعمل بها الموظف (إن وجد)

    @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
    departmentId?: Types.ObjectId;  // القسم الذي يعمل به الطبيب أو الموظف (إن وجد)

    @Prop({ type: [Types.ObjectId], ref: 'Clinic', default: [] })
    clinics: Types.ObjectId[]; // العيادات التي يعمل بها الطبيب أو الموظف (يمكن أن يعمل في أكثر من عيادة)

    @Prop({ type: Types.ObjectId, ref: 'Doctor', default: null })
    doctorId?: Types.ObjectId;  // مرجع إلى جدول الأطباء (إن كان المستخدم طبيبًا)

    @Prop({ type: Types.ObjectId, ref: 'Employee', default: null })
    employeeId?: Types.ObjectId;  // مرجع إلى جدول الموظفين (إن كان المستخدم موظفًا)
}
export const UserSchema = SchemaFactory.createForClass(User);
