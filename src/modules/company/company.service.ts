import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeService } from '../employee/employee.service';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user_id: string,
  ): Promise<ApiGetResponse<Company>> {
    try {
      const createdCompany = new this.companyModel(createCompanyDto);
      const savedCompany = await createdCompany.save();
      const userResponse = await this.userService.getUserById(user_id);

      const employeeId = userResponse.data.employeeId;

      if (employeeId) {
        try {
          console.log(
            `Attempting to assign company ${savedCompany._id} to employee `,
          );
          await this.employeeService.updateEmployee(employeeId._id.toString(), {
            companyId: savedCompany._id,
          });
          console.log(
            `Successfully assigned company ${savedCompany._id} to employee `,
          );
        } catch (err) {
          console.error(`Failed to assign company to employee :`, err.message);
        }
      } else {
        console.warn(
          `User ${user_id} does not have an employeeId. Cannot assign company to employee.`,
        );
      }

      return {
        success: true,
        message: 'Company created successfully',
        data: savedCompany,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async findAll(paginationDto: PaginationAndFilterDto, filters: any) {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      // Convert page & limit to numbers
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      const sortField: string = sortBy ?? 'id';
      const sort: Record<string, number> = {
        [sortField]: order === 'asc' ? 1 : -1,
      };
      return paginate(
        this.companyModel,
        [],
        page,
        limit,
        allData,
        filters,
        sort,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
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
      console.log(error);
      throw new BadRequestException(error);
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
        message: 'Company update successfully',
        data: updatedCompany,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async remove(id: string): Promise<ApiGetResponse<Company>> {
    try {
      const result = await this.companyModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      return {
        success: true,
        message: 'Company remove successfully',
        data: {} as Company,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
