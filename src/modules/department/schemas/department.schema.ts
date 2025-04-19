import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {ContactInfo} from "../../../common/utlis/helper";
export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  _id: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  name: string;

    @Prop()
    description?: string;
// //
//     @Prop()
//     overview?: string;

  @Prop({ type: Date })
  yearOfEstablishment?: Date;

    @Prop()
    address: string;
// //
//     @Prop()
//     logo: string;
// //
//     @Prop()
//     vision?: string;
// //
//     @Prop()
//     goals?: string;
    
    @Prop()
    patientCapacity: number;  // قدرة استيعاب المرضى
// //
//     @Prop({type: [ContactInfo], default: []})
//     contactInfos: ContactInfo[];

  @Prop({ type: Types.ObjectId, ref: 'ClinicCollection', required: true })
  clinicCollectionId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  requiredStaff: string[];//  الكادر المطلوب  

  @Prop({ type: [Types.ObjectId], ref: 'Specialization', required: true })
  specializations: Types.ObjectId[];  // قائمة بمعرفات الاختصاصات المرتبطة بالقسم
  @Prop({ unique: true, required: true })
  publicId: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
