import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ClinicCollection, ClinicCollectionDocument} from "./schemas/cliniccollection.schema";
import {UpdateClinicCollectionDto} from "./dto/update-clinic-collection.dto";
import {CreateClinicCollectionDto} from "./dto/create-clinic-collection.dto";

@Injectable()
export class ClinicCollectionService {
    constructor(@InjectModel(ClinicCollection.name) private clinicCollectionModel: Model<ClinicCollectionDocument>) {
    }

    async createClinicCollection(createClinicCollectionDto: CreateClinicCollectionDto): Promise<ClinicCollection> {
        const newClinicCollection = new this.clinicCollectionModel(createClinicCollectionDto);
        return newClinicCollection.save();
    }

    async getAllClinicCollections(): Promise<ClinicCollection[]> {
        return this.clinicCollectionModel.find().populate(['companyId',  ]).exec();
    }

    async getClinicCollectionById(id: string): Promise<ClinicCollection> {
        const clinicCollection = await this.clinicCollectionModel.findById(id).populate(['companyId',  ]);
        if (!clinicCollection) throw new NotFoundException('Clinic Collection not found');
        return clinicCollection;
    }

    async updateClinicCollection(id: string, updateClinicCollectionDto: UpdateClinicCollectionDto): Promise<ClinicCollection> {
        const updatedClinicCollection = await this.clinicCollectionModel.findByIdAndUpdate(id, updateClinicCollectionDto, {new: true}).populate(['companyId',  ]);
        if (!updatedClinicCollection) throw new NotFoundException('Clinic Collection not found');
        return updatedClinicCollection;
    }

    async deleteClinicCollection(id: string): Promise<void> {
        const deletedClinicCollection = await this.clinicCollectionModel.findByIdAndDelete(id);
        if (!deletedClinicCollection) throw new NotFoundException('Clinic Collection not found');
    }
}
