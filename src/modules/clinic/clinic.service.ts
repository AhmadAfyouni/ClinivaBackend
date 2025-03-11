import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clinic, ClinicDocument } from './schemas/clinic.schema';
import {CreateClinicDto} from "./dto/create-clinic.dto";
import {UpdateClinicDto} from "./dto/update-clinic.dto";

@Injectable()
export class ClinicService {
    constructor(@InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>) {}

    async createClinic(createClinicDto: CreateClinicDto): Promise<Clinic> {
        const newClinic = new this.clinicModel(createClinicDto);
        return newClinic.save();
    }

    async getAllClinics(): Promise<Clinic[]> {
        return this.clinicModel.find().populate(['departmentId', 'clinicCollectionId', 'doctors', 'employees']).exec();
    }

    async getClinicById(id: string): Promise<Clinic> {
        const clinic = await this.clinicModel.findById(id).populate(['departmentId', 'clinicCollectionId', 'doctors', 'employees']);
        if (!clinic) throw new NotFoundException('Clinic not found');
        return clinic;
    }

    async updateClinic(id: string, updateClinicDto: UpdateClinicDto): Promise<Clinic> {
        const updatedClinic = await this.clinicModel.findByIdAndUpdate(id, updateClinicDto, { new: true }).populate(['departmentId', 'clinicCollectionId', 'doctors', 'employees']);
        if (!updatedClinic) throw new NotFoundException('Clinic not found');
        return updatedClinic;
    }

    async deleteClinic(id: string): Promise<void> {
        const deletedClinic = await this.clinicModel.findByIdAndDelete(id);
        if (!deletedClinic) throw new NotFoundException('Clinic not found');
    }
}
