import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import {CreateDepartmentDto} from "./dto/create-department.dto"
import {UpdateDepartmentDto} from "./dto/update-department.dto";

@Injectable()
export class DepartmentService {
    constructor(@InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>) {}

    async createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
        const newDepartment = new this.departmentModel(createDepartmentDto);
        return newDepartment.save();
    }

    async getAllDepartments(): Promise<Department[]> {
        return this.departmentModel.find().populate(['clinicCollectionId', 'clinics']).exec();
    }

    async getDepartmentById(id: string): Promise<Department> {
        const department = await this.departmentModel.findById(id).populate(['clinicCollectionId', 'clinics']);
        if (!department) throw new NotFoundException('Department not found');
        return department;
    }

    async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
        const updatedDepartment = await this.departmentModel.findByIdAndUpdate(id, updateDepartmentDto, { new: true }).populate(['clinicCollectionId', 'clinics']);
        if (!updatedDepartment) throw new NotFoundException('Department not found');
        return updatedDepartment;
    }

    async deleteDepartment(id: string): Promise<void> {
        const deletedDepartment = await this.departmentModel.findByIdAndDelete(id);
        if (!deletedDepartment) throw new NotFoundException('Department not found');
    }
}
