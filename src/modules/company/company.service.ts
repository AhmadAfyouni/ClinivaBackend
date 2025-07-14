import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from '../employee/schemas/employee.schema';
import { EmployeeService } from '../employee/employee.service';
import { FilterQuery, get, Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiGetResponse, paginate, SortType } from 'src/common/utils/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { saveFileLocally } from 'src/common/utils/upload.util';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    private readonly employeeService: EmployeeService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    employeeId: string,
    file: Express.Multer.File,
  ): Promise<ApiGetResponse<Company>> {
    try {
      console.log(createCompanyDto);
      const companyData = {
        tradeName: createCompanyDto.tradeName,
        legalName: createCompanyDto.legalName,
        logo: createCompanyDto.logo,
        generalInfo: createCompanyDto.generalInfo
          ? {
              logo: createCompanyDto.generalInfo.logo,
              yearOfEstablishment:
                createCompanyDto.generalInfo.yearOfEstablishment,
              vision: createCompanyDto.generalInfo.vision,
              goals: createCompanyDto.generalInfo.goals,
              overview: createCompanyDto.generalInfo.overview,
              ceo: createCompanyDto.generalInfo.ceo,
              contactInformation:
                createCompanyDto.generalInfo.contactInformation,
              LinkedIn: createCompanyDto.generalInfo.LinkedIn,
              Twitter: createCompanyDto.generalInfo.Twitter,
              Facebook: createCompanyDto.generalInfo.Facebook,
              Instagram: createCompanyDto.generalInfo.Instagram,
              FinanceInfo: createCompanyDto.generalInfo.FinanceInfo,
              PrivacyPolicy: createCompanyDto.generalInfo.PrivacyPolicy,
              TermsConditions: createCompanyDto.generalInfo.TermsConditions,
              Key_member: createCompanyDto.generalInfo.Key_member,
              Founder_Executives:
                createCompanyDto.generalInfo.Founder_Executives,
            }
          : {},
      };
      let relativeFilePath;
      if (file) {
        relativeFilePath = file ? saveFileLocally(file, 'company/images') : '';
      }
      companyData.logo = relativeFilePath;
      const employee = await this.employeeModel.findById(employeeId);
      if (!employee) {
        throw new InternalServerErrorException(
          'Employee not found on create company',
        );
      }

      // Update the employee
      let savedCompany;
      if (employee.first_login && employee.Owner) {
        const createdCompany = new this.companyModel(companyData);
        savedCompany = await createdCompany.save();
        employee.companyId = savedCompany._id;
        employee.first_login = false;
        await employee.save();
      } else {
        throw new BadRequestException(
          'Employee is not first login or not Owner',
        );
      }

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
      let { page, limit, allData, sortBy, order, search, deleted } =
        paginationDto;

      // Convert page & limit to numbers
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField: string = sortBy ?? 'createdAt';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };
      const query: FilterQuery<Company> = { ...filters };

      if (search) {
        delete query.tradeName;
        delete query.legalName;

        query.$or = [
          { tradeName: { $regex: search, $options: 'i' } },
          { legalName: { $regex: search, $options: 'i' } },
        ];
      }

      if (deleted !== undefined) {
        // Assuming your schema field is 'isDeleted'
        query.isDeleted = deleted;
      }

      return paginate({
        model: this.companyModel,
        populate: [{ path: 'generalInfo' }],
        page,
        limit,
        allData,
        filter: query,
        // filter: filters,
        sort: sort,
      });
    } catch (error) {
      console.error('Error finding companies:', error);
      throw new BadRequestException(
        error.message || 'Failed to retrieve companies',
      );
    }
  }

  async findAll_(paginationDto: PaginationAndFilterDto) {
    try {
      // Destructure all the properties you need from the DTO
      const { page, limit, allData, sortBy, order, search, deleted } =
        paginationDto;

      const sortField: string = sortBy ?? 'createdAt';
      const sort: { [key: string]: 1 | -1 } = {
        [sortField]: order === 'asc' ? 1 : -1,
      };

      // --- THIS IS THE CORE FIX ---
      // 1. Create a dynamic query object
      const query: FilterQuery<Company> = {};

      // 2. Add search logic if the 'search' parameter exists
      if (search) {
        query.$or = [
          { tradeName: { $regex: search, $options: 'i' } },
          { legalName: { $regex: search, $options: 'i' } },
        ];
      }

      // 3. Add deletion status logic if the 'deleted' parameter exists
      // We check for `undefined` because the value could be `false`
      if (deleted !== undefined) {
        // Assuming your schema field is named 'isDeleted'. Change if necessary.
        query.isDeleted = deleted;
      }

      // 4. Pass the correctly built 'query' object to your paginate helper
      return paginate({
        model: this.companyModel,
        populate: [{ path: 'generalInfo' }],
        page,
        limit,
        allData,
        filter: query, // Use the new query object
        sort: sort,
      });
    } catch (error) {
      console.error('Error finding companies:', error);
      throw new BadRequestException(
        error.message || 'Failed to retrieve companies',
      );
    }
  }

  async findOne(
    id: string,
    employee: Employee,
  ): Promise<ApiGetResponse<Company>> {
    try {
      if (employee.companyId?.toString() !== id) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
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

  async findByUser(employee: Employee): Promise<ApiGetResponse<Company>> {
    try {
      if (!employee.companyId) {
        throw new NotFoundException(`no company found !`);
      }
      const company = await this.companyModel
        .findById(employee.companyId)
        .exec();
      if (!company) {
        throw new NotFoundException(`Company not found`);
      }
      return {
        success: true,
        message: 'Company retrieved successfully',
        data: company,
      };
    } catch (error) {
      console.error(`Error finding company :`, error);
      throw new BadRequestException(
        error.message || 'Failed to retrieve company',
      );
    }
  }
  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    file: Express.Multer.File,
    employee: Employee,
  ): Promise<ApiGetResponse<Company>> {
    try {
      let relativeFilePath;
      if (employee.companyId?.toString() !== id) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      if (file) {
        relativeFilePath = file ? saveFileLocally(file, 'company/images') : '';
      }
      updateCompanyDto.logo = relativeFilePath;
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
