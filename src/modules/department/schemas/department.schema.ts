import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {ContactInfo} from "../../../common/utlis/helper";

export type DepartmentDocument = Department & Document;

@Schema({timestamps: true})
export class Department {
    @Prop({required: true})
    name: string;

    @Prop()
    introduction?: string;

    @Prop({type: Date})
    yearOfEstablishment?: Date;

    @Prop()
    address: string;

    @Prop()
    logo: string;

    @Prop()
    vision?: string;

    @Prop()
    details?: string;

    @Prop({type: [ContactInfo], default: []})
    ContactInfos: ContactInfo[];

    @Prop({type: Types.ObjectId, ref: 'ClinicCollection', required: true})
    clinicCollectionId: Types.ObjectId;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
