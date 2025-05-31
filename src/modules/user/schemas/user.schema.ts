import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityLog, LoginHistory } from 'src/common/utils/helper';
import { MongooseDocument } from 'src/common/utils/filter-sort.util';

export type UserDocument = User & MongooseDocument;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({
    required: [true, 'Name is required'],
    unique: true,
    uniqueCaseInsensitive: true,
    trim: true,
    // validate: {
    //   validator: function(v: string) {
    //     return /^[a-zA-Z\s]+$/.test(v);
    //   },
    //   message: (props: any) => `${props.value} is not a valid name! Only letters and spaces are allowed.`
    // }
  })
  name: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    uniqueCaseInsensitive: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Role', required: true })
  roleIds: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ['Admin', 'Doctor', 'Medical Staff', 'Staff'],
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

// Add post-save hook to handle duplicate key errors
UserSchema.post('save', function (error: any, doc: any, next: any) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already in use. Please enter a unique value for this field.`;
    next(new Error(message));
  } else {
    next(error);
  }
});
