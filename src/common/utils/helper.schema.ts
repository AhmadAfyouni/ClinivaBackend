import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseModel, ShiftBase } from './base.helper';
import { ContactInfoBase, VacationBase, WorkingHoursBase } from './helper.dto';

// Shift Schema
export type ShiftDocument = ShiftBase & Document;

export const ShiftSchema = SchemaFactory.createForClass(ShiftBase);

// WorkingHours Schema
export type WorkingHoursDocument = WorkingHoursBase & Document;

export const WorkingHoursSchema =
  SchemaFactory.createForClass(WorkingHoursBase);

// ContactInfo Schema
export type ContactInfoDocument = ContactInfoBase & Document;

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfoBase);

// Vacation Schema
export type VacationDocument = VacationBase & Document;

export const VacationSchema = SchemaFactory.createForClass(VacationBase);

// Add timestamps to all schemas
[ShiftSchema, WorkingHoursSchema, ContactInfoSchema, VacationSchema].forEach(
  (schema) => {
    schema.set('timestamps', true);
  },
);

// Export all schemas
export const HelperSchemas = {
  name: 'Shift',
  schema: ShiftSchema,
  collection: 'shifts',
};

export const WorkingHoursSchemas = {
  name: 'WorkingHours',
  schema: WorkingHoursSchema,
  collection: 'working_hours',
};

export const ContactInfoSchemas = {
  name: 'ContactInfo',
  schema: ContactInfoSchema,
  collection: 'contact_infos',
};

export const VacationSchemas = {
  name: 'Vacation',
  schema: VacationSchema,
  collection: 'vacations',
};
