import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import {CreateDoctorDto} from "./dto/create-doctor.dto";
import {UpdateDoctorDto} from "./dto/update-doctor.dto";


@Injectable()
export class DoctorService {
    constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

    async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
        const newDoctor = new this.doctorModel(createDoctorDto);
        return newDoctor.save();
    }

    async getAllDoctors(): Promise<Doctor[]> {
        return this.doctorModel.find().exec();
    }

    async getDoctorById(id: string): Promise<Doctor> {
        const doctor = await this.doctorModel.findById(id).exec();
        if (!doctor) throw new NotFoundException('Doctor not found');
        return doctor;
    }

    async updateDoctor(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
        const updatedDoctor = await this.doctorModel.findByIdAndUpdate(id, updateDoctorDto, { new: true }).exec();
        if (!updatedDoctor) throw new NotFoundException('Doctor not found');
        return updatedDoctor;
    }

    async deleteDoctor(id: string): Promise<void> {
        const deletedDoctor = await this.doctorModel.findByIdAndDelete(id).exec();
        if (!deletedDoctor) throw new NotFoundException('Doctor not found');
    }
}
