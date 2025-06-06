import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Service } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { Clinic } from '../clinic/schemas/clinic.schema';
import { Employee } from '../employee/schemas/employee.schema';
import { ApiGetResponse, paginate, SortType } from 'src/common/utils/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { generateUniquePublicId } from 'src/common/utils/id-generator';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Service') private readonly serviceModel: Model<Service>,
    @InjectModel('Clinic') private readonly clinicModel: Model<Clinic>,
    @InjectModel('Employee') private readonly employeeModel: Model<Employee>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<any> {
    try {
      if (!isValidObjectId(createServiceDto.clinic)) {
        throw new BadRequestException('Invalid clinic ID.');
      }
      if (
        !Array.isArray(createServiceDto.doctors) ||
        createServiceDto.doctors.length === 0
      ) {
        throw new BadRequestException('Doctors list must not be empty.');
      }
      for (const doctorId of createServiceDto.doctors) {
        if (!isValidObjectId(doctorId)) {
          throw new BadRequestException(`Invalid doctor ID: ${doctorId}`);
        }
      }
      const clinic = await this.clinicModel
        .findOne({ _id: createServiceDto.clinic, isActive: true })
        .exec();
      if (!clinic) {
        throw new BadRequestException(
          'Clinic does not exist or is not active.',
        );
      }
      const hasComplex = !!clinic.collection;
      const doctors = await this.employeeModel.find({
        _id: { $in: createServiceDto.doctors },
        isActive: true,
        clinics: clinic._id,
        $or: [
          { employeeType: 'Doctor' },
          { specialization: { $exists: true, $ne: [] } },
        ],
      });
      const hasDoctor = doctors.length > 0;
      if (!(clinic || hasComplex || hasDoctor)) {
        throw new BadRequestException(
          'At least one precondition must be satisfied: (1) Clinic exists and is active, (2) Clinic assigned to a complex, (3) At least one valid doctor assigned to the clinic.',
        );
      }
      const existingService = await this.serviceModel.findOne({
        name: createServiceDto.name,
        clinic: createServiceDto.clinic,
        doctors: { $in: createServiceDto.doctors },
      });
      if (existingService) {
        throw new BadRequestException(
          'A service with this name already exists for the same clinic and doctor.',
        );
      }
      const publicId = await generateUniquePublicId(this.serviceModel, 'ser');

      const service = new this.serviceModel({
        ...createServiceDto,
        isActive: true,
        publicId,
      });
      const savedService = await service.save();
      return {
        success: true,
        message: 'Service created successfully',
        data: savedService,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  async findAll(
    paginationDto: {
      page?: number;
      limit?: number;
      allData?: boolean;
      sortBy?: string;
      order?: 'asc' | 'desc';
      search?: string;
    },
    filters: any,
  ) {
    try {
      let { page, limit, allData, sortBy, order, search } = paginationDto;

      // Default pagination values
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      const sortField = sortBy ?? 'id';
      const sort: SortType = { [sortField]: order === 'asc' ? 1 : -1 };
      filters.deleted = { $ne: true };

      // Handle search query
      if (search) {
        const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
        filters.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { 'clinic.name': searchRegex },
          { 'doctors.name': searchRegex },
          { 'doctors.specializations': searchRegex },
        ];
      }

      // Handle doctorId filter: convert to ObjectId and build $in query
      if (filters.doctorId) {
        if (!isValidObjectId(filters.doctorId)) {
          throw new BadRequestException('Invalid doctor ID provided.');
        }
        filters.doctors = { $in: [new Types.ObjectId(filters.doctorId)] };
        delete filters.doctorId;
      }

      // Populate clinic with only name & address, and doctors with name & specialization
      const populateOptions = [
        { path: 'clinic', model: 'Clinic', select: 'name address' },
        { path: 'doctors', model: 'Employee', select: 'name specializations' },
      ];
      const result = await paginate({
        model: this.serviceModel,
        populate: populateOptions,
        page,
        limit,
        allData,
        filter: filters,
        sort: sort,
      });

      return result;
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch services');
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const service = await this.serviceModel.findById(id).exec();
      if (!service || service.deleted) {
        throw new NotFoundException(
          `Service with ID ${id} not found or has been deleted`,
        );
      }
      return {
        success: true,
        message: 'Service retrieved successfully',
        data: service,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch service');
    }
  }

  async update(id: string, updateServiceDto: any): Promise<any> {
    try {
      const updatedService = await this.serviceModel
        .findByIdAndUpdate(id, updateServiceDto, { new: true })
        .exec();
      if (!updatedService || updatedService.deleted) {
        throw new NotFoundException(
          `Service with ID ${id} not found or has been deleted`,
        );
      }
      return {
        success: true,
        message: 'Service updated successfully',
        data: updatedService,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update service');
    }
  }

  async deleteService(id: string): Promise<ApiGetResponse<Service>> {
    try {
      const service = await this.serviceModel.findById(id).exec();
      if (!service || service.deleted)
        throw new NotFoundException('Service not found or has been deleted');

      service.deleted = true;
      service.name = service.name + ' (Deleted)' + service.publicId;
      const deletedService = await service.save();

      return {
        success: true,
        message: 'Service marked as deleted successfully',
        data: deletedService,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
