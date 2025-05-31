import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CommercialRecordDTO } from 'src/common/utils';

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  _id: Types.ObjectId;

  @Prop({ required: true })
  nameTrade: string;

  @Prop({ required: true })
  nameLegal: string;

  @Prop({ required: true })
  ceo: string;

  @Prop()
  address: string;

  @Prop({ type: CommercialRecordDTO })
  commercialRecord: CommercialRecordDTO;

  @Prop({ type: Object })
  locationGoogl: { x: number; y: number };

  @Prop({ default: false })
  deleted: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
