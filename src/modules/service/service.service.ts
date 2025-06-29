import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId, model } from 'mongoose';
import { Service } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { Clinic } from '../clinic/schemas/clinic.schema';
import { Employee } from '../employee/schemas/employee.schema';
import { ApiGetResponse, paginate, SortType } from 'src/common/utils/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { generateUniquePublicId } from 'src/common/utils/id-generator';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Service') private readonly serviceModel: Model<Service>,
    @InjectModel('Clinic') private readonly clinicModel: Model<Clinic>,
    @InjectModel('Employee') private readonly employeeModel: Model<Employee>,
  ) {}

  async verifyClinicsBelongToComplex(
    clinicIds: string[],
    complexId: string,
  ): Promise<string[]> {
    console.log('Verifying clinics:', clinicIds, 'for complex:', complexId);

    // Find all clinics with their departments
    const clinics = await this.clinicModel
      .find({
        _id: { $in: clinicIds },
      })
      .populate('departmentId', 'clinicCollectionId')
      .lean();

    const invalidClinics = clinics.filter((clinic) => {
      if (
        !clinic.departmentId ||
        !(clinic.departmentId as any).clinicCollectionId
      ) {
        return true;
      }
      return (
        (clinic.departmentId as any).clinicCollectionId.toString() !== complexId
      );
    });

    return invalidClinics.map((clinic) => clinic._id.toString());
  }

  async create(createServiceDto: CreateServiceDto): Promise<any> {
    try {
      if (createServiceDto.clinics && createServiceDto.clinics.length > 0) {
        for (const clinicId of createServiceDto.clinics) {
          if (!isValidObjectId(clinicId)) {
            throw new BadRequestException(`Invalid clinic ID: ${clinicId}`);
          }
        }
      }

      if (createServiceDto.doctor && createServiceDto.doctor.length > 0) {
        for (const clinicId of createServiceDto.doctor) {
          if (!isValidObjectId(clinicId)) {
            throw new BadRequestException(`Invalid Doctors ID: ${clinicId}`);
          }
        }
      }

      const clinics = await this.clinicModel
        .find({
          _id: { $in: createServiceDto.clinics },
          isActive: true,
        })
        .exec();
      if (clinics.length === 0) {
        throw new BadRequestException(
          'No active clinics found for the provided IDs.',
        );
      }

      const doctors = await this.employeeModel.find({
        _id: { $in: createServiceDto.doctor },
        isActive: true,
        employeeType: 'Doctor',
      });
      const hasDoctor = doctors.length > 0;
      if (!hasDoctor) {
        throw new BadRequestException('No valid doctors found.');
      }
      console.log('111', createServiceDto.complex);
      console.log('222', createServiceDto);
      const invalidClinics = await this.verifyClinicsBelongToComplex(
        createServiceDto.clinics || [],
        createServiceDto.complex || '',
      );
      if (invalidClinics.length > 0) {
        throw new BadRequestException(
          `The following clinics do not belong to the complex: ${invalidClinics.join(', ')}`,
        );
      }
      const existingService = await this.serviceModel.findOne({
        name: createServiceDto.name,
        clinics: { $in: createServiceDto.clinics },
        doctor: { $in: createServiceDto.doctor },
      });
      if (existingService) {
        throw new BadRequestException(
          'A service with this name already exists for the same clinics and doctors.',
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

      page = Number(page) || 1;
      limit = Number(limit) || 10;
      const sortField = sortBy ?? 'id';
      const sort: SortType = { [sortField]: order === 'asc' ? 1 : -1 };
      filters.deleted = { $ne: true };

      if (search) {
        const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
        filters.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { 'clinic.name': searchRegex },
          { 'doctor.name': searchRegex },
          { 'doctor.specializations': searchRegex },
        ];
      }

      if (filters.doctorId) {
        if (!isValidObjectId(filters.doctorId)) {
          throw new BadRequestException('Invalid doctor ID provided.');
        }
        filters.doctor = { $in: [new Types.ObjectId(filters.doctorId)] };
        delete filters.doctorId;
      }

      const populateOptions = [
        { path: 'clinics', model: 'Clinic' },
        { path: 'doctor', model: 'Employee' },
        // { path: 'complex', model: 'Complex' },
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

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<any> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid service ID.');
      }

      if (updateServiceDto.clinics && updateServiceDto.clinics.length > 0) {
        for (const clinicId of updateServiceDto.clinics) {
          if (!isValidObjectId(clinicId)) {
            throw new BadRequestException(`Invalid clinic ID: ${clinicId}`);
          }
        }

        const clinics = await this.clinicModel
          .find({
            _id: { $in: updateServiceDto.clinics },
            isActive: true,
          })
          .exec();
        if (clinics.length === 0) {
          throw new BadRequestException(
            'No active clinics found for the provided IDs.',
          );
        }
      }

      if (updateServiceDto.doctor && updateServiceDto.doctor.length > 0) {
        for (const doctorId of updateServiceDto.doctor) {
          if (!isValidObjectId(doctorId)) {
            throw new BadRequestException(`Invalid doctor ID: ${doctorId}`);
          }
        }

        const doctors = await this.employeeModel.find({
          _id: { $in: updateServiceDto.doctor },
          isActive: true,
          employeeType: 'Doctor',
        });
        const hasDoctor = doctors.length > 0;
        if (!hasDoctor) {
          throw new BadRequestException(
            'No valid doctors found assigned to the provided clinics.',
          );
        }
      }

      const updatedService = await this.serviceModel
        .findByIdAndUpdate(id, updateServiceDto, { new: true })
        .exec();

      if (!updatedService || updatedService.deleted) {
        throw new NotFoundException(
          `Service with ID ${id} not found or has been deleted.`,
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
      if (service?.isActive)
        throw new NotFoundException("can't delete active Service!");

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
