import { Prop } from '@nestjs/mongoose';

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export class Shift {
  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;
}

export class WorkingHours {
  @Prop({
    required: true,
    enum: DayOfWeek,
  })
  day: string;

  @Prop({
    required: true,
    type: Shift,
    default: { startTime: '08:00', endTime: '13:00' },
  })
  shift1: Shift;

  @Prop({
    required: true,
    type: Shift,
    default: { startTime: '14:00', endTime: '19:00' },
  })
  shift2: Shift;
}

export class ContactInfo {
  @Prop({ required: true })
  phoneNumber1: string;

  @Prop({ required: true })
  phoneNumber2: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  buildingNumber: string;

  @Prop({ required: true })
  streetName: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  nation: string;

  @Prop({ required: true })
  emergencyContactName: string;

  @Prop({ required: true })
  emergencyContactPhone: string;
}

export class Vacation {
  @Prop({ required: true, type: Date })
  leaveStartDate: Date;

  @Prop({ required: true, type: Date })
  leaveEndDate: Date;

  @Prop({ required: true, enum: ['Vacation', 'Sick Leave', 'Emergency'] })
  leaveType: string;

  @Prop({ required: true, enum: ['Approved', 'Pending'], default: 'Pending' })
  status: string;
}

export class Medication {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dosage: string;
}

export class ActivityLog {
  @Prop({ type: Date, required: true })
  activityDate: Date;

  @Prop({ type: String, required: true })
  description: string;
}

export class LoginHistory {
  @Prop({ type: Date, required: true })
  loginDate: Date;

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: String, required: true })
  device: string;
}
