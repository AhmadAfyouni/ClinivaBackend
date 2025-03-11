import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import {CreateCompanyDto, UpdateCompanyDto} from "./dto/create-company.dto";

@Injectable()
export class CompanyService {
    constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {}

    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        const createdCompany = new this.companyModel(createCompanyDto);
        return createdCompany.save();
    }

    async findAll(): Promise<Company[]> {
        return this.companyModel.find().populate('clinicCollections').exec();
    }

    async findOne(id: string): Promise<Company> {
        const company = await this.companyModel.findById(id).populate('clinicCollections').exec();
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true }).exec();
        if (!updatedCompany) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return updatedCompany;
    }

    async remove(id: string): Promise<void> {
        const result = await this.companyModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
    }
}
