import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkingHours } from 'src/common/utils/helper';
import { GeneralInfo } from 'src/common/utils/helper.dto';

export type ComplexDocument = Complex & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Complex {
  _id: Types.ObjectId;

  @Prop({ required: true })
  tradeName: string;

  @Prop({ required: true })
  legalName: string;

  @Prop({ type: GeneralInfo })
  generalInfo: GeneralInfo;

  @Prop({ required: true })
  patientCapacity: number;

  @Prop({ required: false })
  logo: string;

  @Prop({ type: String, required: false })
  policies: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Company', default: null })
  companyId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: false })
  PIC: Types.ObjectId;

  @Prop({ unique: true, required: true })
  publicId: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;

  @Prop({ type: [WorkingHours], default: [] })
  WorkingHours?: WorkingHours[];
}

export const ClinicCollectionSchema = SchemaFactory.createForClass(Complex);
