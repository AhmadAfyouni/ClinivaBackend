import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { EmployeeService } from '../employee/employee.service';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiGetResponse, paginate, SortType } from 'src/common/utils/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    // private readonly employeeService: EmployeeService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    employeeId: string,
  ): Promise<ApiGetResponse<Company>> {
    try {
      // Create the company
      const createdCompany = new this.companyModel(createCompanyDto);
      const savedCompany = await createdCompany.save();

      // Update the employee with the company ID
      // await this.employeeService.updateEmployee(employeeId, {
      //   companyId: savedCompany._id,
      // });

      return {
        success: true,
        message: 'Company created successfully',
        data: savedCompany,
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw new BadRequestException(
        error.message || 'Failed to create company',
      );
    }
  }

  async findAll(paginationDto: PaginationAndFilterDto, filters: any) {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      // Convert page & limit to numbers
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField: string = sortBy ?? 'createdAt';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };

      return paginate({
        model: this.companyModel,
        populate: [],
        page,
        limit,
        allData,
        filter: filters,
        sort: sort,
      });
    } catch (error) {
      console.error('Error finding companies:', error);
      throw new BadRequestException(
        error.message || 'Failed to retrieve companies',
      );
    }
  }

  async findOne(id: string): Promise<ApiGetResponse<Company>> {
    try {
      const company = await this.companyModel.findById(id).exec();
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      return {
        success: true,
        message: 'Company retrieved successfully',
        data: company,
      };
    } catch (error) {
      console.error(`Error finding company with ID ${id}:`, error);
      throw new BadRequestException(
        error.message || 'Failed to retrieve company',
      );
    }
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<ApiGetResponse<Company>> {
    try {
      const updatedCompany = await this.companyModel
        .findByIdAndUpdate(id, updateCompanyDto, { new: true })
        .exec();
      if (!updatedCompany) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      return {
        success: true,
        message: 'Company updated successfully',
        data: updatedCompany,
      };
    } catch (error) {
      console.error(`Error updating company with ID ${id}:`, error);
      throw new BadRequestException(
        error.message || 'Failed to update company',
      );
    }
  }

  async remove(id: string): Promise<ApiGetResponse<Company | null>> {
    try {
      // First, find the company to get its ID
      const company = await this.companyModel.findById(id).exec();
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      // Remove company reference from all employees
      // await this.employeeService['employeeModel']
      //   .updateMany(
      //     { companyId: id },
      //     { $unset: { companyId: '' } }
      //   )
      //   .exec();

      // Delete the company
      await this.companyModel.findByIdAndDelete(id).exec();

      return {
        success: true,
        message: 'Company removed successfully',
        data: null,
      };
    } catch (error) {
      console.error(`Error removing company with ID ${id}:`, error);
      throw new BadRequestException(
        error.message || 'Failed to remove company',
      );
    }
  }
}
