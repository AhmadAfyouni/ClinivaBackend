import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Company, CompanyDocument} from './schemas/company.schema';
import {CreateCompanyDto} from "./dto/create-company.dto";
import {UpdateCompanyDto} from "./dto/update-company.dto";
import { paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class CompanyService {
    constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {
    }

    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        const createdCompany = new this.companyModel(createCompanyDto);
        return createdCompany.save();
    }

    async findAll(paginationDto: PaginationAndFilterDto, filters: any) {

        let { page, limit, allData, sortBy, order } = paginationDto;

        // Convert page & limit to numbers
        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const sortField: string = sortBy ?? 'createdAt';
        const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
        return paginate(this.companyModel,[], page, limit, allData, filters, sort);
    }
    async findOne(id: string): Promise<Company> {
        const company = await this.companyModel.findById(id).exec();
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const updatedCompany = await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, {new: true}).exec();
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
