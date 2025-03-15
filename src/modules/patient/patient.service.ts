import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Patient, PatientDocument} from './schemas/patient.schema';
import {CreatePatientDto} from "./dto/create-patient.dto";
import {UpdatePatientDto} from "./dto/update-patient.dto";

@Injectable()
export class PatientService {
    constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {
    }

    async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
        const newPatient = new this.patientModel(createPatientDto);
        return newPatient.save();
    }

    async getAllPatients(): Promise<Patient[]> {
        return this.patientModel.find().exec();
    }

    async getPatientById(id: string): Promise<Patient> {
        const patient = await this.patientModel.findById(id).exec();
        if (!patient) throw new NotFoundException('Patient not found');
        return patient;
    }

    async updatePatient(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
        const updatedPatient = await this.patientModel.findByIdAndUpdate(id, updatePatientDto, {new: true}).exec();
        if (!updatedPatient) throw new NotFoundException('Patient not found');
        return updatedPatient;
    }

    async deletePatient(id: string): Promise<void> {
        const deletedPatient = await this.patientModel.findByIdAndDelete(id).exec();
        if (!deletedPatient) throw new NotFoundException('Patient not found');
    }
}
