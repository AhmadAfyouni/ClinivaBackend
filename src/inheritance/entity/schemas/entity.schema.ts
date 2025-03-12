import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Schema as MongooseSchema } from 'mongoose';

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export class Holiday {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true })
  reason: string;
}

export class ContactInfo {
  @Prop({ required: true })
  value: string;

  @Prop({ required: true, enum: ['email', 'phone', 'socialMedia'] })
  type: string;

  @Prop({ required: true })
  isPublic: boolean;

  @Prop({ required: false })
  subType: string; //  العمل  او المكتب أو الشخصي
}
export class Specialization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}
export class WorkingDays extends Document {
  @Prop({
    required: true,
    enum: DayOfWeek,
  })
  name: DayOfWeek;

  @Prop({ required: true })
  startOfWorkingTime: string;

  @Prop({ required: true })
  endOfWorkingTime: string;
}
@Schema()
export class BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop()
  intro: string;

  @Prop({ type: Date })
  yearOfEstablishment: Date;

  @Prop()
  address: string;

  @Prop()
  logo: string;

  @Prop()
  vision: string;

  @Prop()
  details: string;

  @Prop({ type: [ContactInfo], default: [] })
  ContactInfos: ContactInfo[];

  @Prop({ type: [Holiday], default: [] })
  holidays: Holiday[];

  @Prop({ type: [Specialization], default: [] })
  specialization: Specialization[];

  @Prop({ type: [WorkingDays], default: [] })
  workingDays: WorkingDays[];

  @Prop({ type: Object })
  locationGoogl: { x: number; y: number };
}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
