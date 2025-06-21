import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Specialization,
  SpecializationDocument,
} from './schemas/specialization.schema';
import { Clinic, ClinicDocument } from '../clinic/schemas/clinic.schema';
import {
  Employee,
  EmployeeDocument,
} from '../employee/schemas/employee.schema';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';
import {
  addDateFilter,
  ApiGetResponse,
  applyBooleanFilter,
  buildFinalFilter,
  paginate,
  SortType,
} from 'src/common/utils/paginate';
import { generateUniquePublicId } from 'src/common/utils/id-generator';
@Injectable()
export class SpecializationService {
  constructor(
    @InjectModel(Specialization.name)
    private specializationModel: Model<SpecializationDocument>,
    @InjectModel(Clinic.name)
    private clinicModel: Model<ClinicDocument>,
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
  ) {}

  async createSpecialization(
    createSpecializationDto: CreateSpecializationDto,
  ): Promise<ApiGetResponse<Specialization>> {
    try {
      const existingSpecialization = await this.specializationModel.findOne({
        name: createSpecializationDto.name,
      });
      if (existingSpecialization) {
        throw new BadRequestException('Specialization already exists');
      }
      const publicId = await generateUniquePublicId(
        this.specializationModel,
        'sp',
      );
      const newSpecialization = new this.specializationModel({
        ...createSpecializationDto,
        publicId,
      });
      const savedSpecialization = await newSpecialization.save();
      return {
        success: true,
        message: 'Specialization created successfully',
        data: savedSpecialization,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getAllSpecializations(
    paginationDto: PaginationAndFilterDto,
    filters: any,
  ) {
    try {
      const {
        page,
        limit,
        allData,
        sortBy,
        order,
        search,
        fields,
        filter_fields,
      } = paginationDto;

      const query = {};
      const sortField: string = sortBy ?? 'id';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };
      if (search) {
        query['$or'] = ['name', 'description'].map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        }));
      }

      const result = await paginate({
        model: this.specializationModel,
        populate: [],
        page,
        limit,
        allData,
        filter: filters,
        sort: sort,
      });
      const specializationIds = result.data.map(
        (spec: SpecializationDocument) => spec._id,
      );
      console.log('specializationIds', specializationIds);
      const doctorCountMap = new Map();

      // Process each specialization ID sequentially
      for (const specId of specializationIds as Types.ObjectId[]) {
        const [clinicCount, doctorCount] = await Promise.all([
          // Count clinics for this specialization
          this.clinicModel.countDocuments({
            specializations: specId.toString(),
          }),
          // Count doctors for this specialization
          this.employeeModel.countDocuments({
            specializations: specId.toString(),
            employeeType: 'Doctor',
          }),
        ]);

        doctorCountMap.set(specId.toString(), doctorCount);
      }

      // Add counts to each specialization
      result.data = result.data.map((spec: any) => {
        const specObj = spec.toObject();
        specObj['statistics'] = {
          doctors: doctorCountMap.get(spec._id.toString()) || 0,
        };
        return specObj;
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getSpecializationById(
    id: string,
  ): Promise<ApiGetResponse<Specialization>> {
    try {
      const specialization = await this.specializationModel.findById(id).exec();
      if (!specialization || specialization.deleted)
        throw new NotFoundException(
          'Specialization not found or has been deleted',
        );

      // Get clinic and doctor counts in parallel
      console.log('Searching for specialization counts with ID:', id);
      const [clinicCount, doctorCount] = await Promise.all([
        // Count clinics
        this.clinicModel.countDocuments({
          specializations: id,
        }),
        // Count doctors
        this.employeeModel.countDocuments({
          specializations: id,
          employeeType: 'Doctor',
        }),
      ]);

      const specObj = specialization.toObject();
      specObj['statistics'] = {
        doctors: doctorCount,
      };

      return {
        success: true,
        message: 'Specialization retrieved successfully',
        data: specObj,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async updateSpecialization(
    id: string,
    updateSpecializationDto: UpdateSpecializationDto,
  ): Promise<ApiGetResponse<Specialization>> {
    try {
      const updatedSpecialization = await this.specializationModel
        .findByIdAndUpdate(id, updateSpecializationDto, { new: true })
        .exec();
      if (!updatedSpecialization || updatedSpecialization.deleted)
        throw new NotFoundException(
          'Specialization not found or has been deleted',
        );

      const doctorCount = await this.employeeModel.countDocuments({
        specializations: id,
        employeeType: 'Doctor',
      });
      console.log('updateSpecializationDto', updateSpecializationDto);
      if (updateSpecializationDto.isActive == false && doctorCount > 0) {
        throw new BadRequestException(
          'Specialization cannot be deleted as it has associated doctors and may have appointment',
        );
      }

      return {
        success: true,
        message: 'Specialization updated successfully',
        data: updatedSpecialization,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteSpecialization(
    id: string,
  ): Promise<ApiGetResponse<Specialization>> {
    try {
      const specialization = await this.specializationModel.findById(id).exec();
      if (!specialization || specialization.deleted)
        throw new NotFoundException(
          'Specialization not found or has been deleted',
        );

      if (specialization.isActive == true) {
        throw new BadRequestException(
          'Specialization cannot be deleted as it is active',
        );
      }

      specialization.deleted = true;
      specialization.name =
        specialization.name + ' (Deleted)' + specialization.publicId;
      const deletedSpecialization = await specialization.save();

      return {
        success: true,
        message: 'Specialization marked as deleted successfully',
        data: deletedSpecialization,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
