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
      let { page, limit, allData, sortBy, order } = paginationDto;

      // Convert page & limit to numbers
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      filters.deleted = { $ne: true };
      const sortField: string = sortBy ?? 'id';
      const sort: SortType = {
        [sortField]: order === 'asc' ? 1 : -1,
      };

      const searchConditions: any[] = [];
      const filterConditions: any[] = [];
      await applyBooleanFilter(filters, 'isActive', filterConditions);
      // تحقق إذا كان يوجد نص للبحث في الحقول النصية (name, email)
      if (filters.search) {
        const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الأحرف

        // إضافة شروط البحث للحقول النصية
        searchConditions.push(
          { name: regex }, // البحث في الحقل name
        );
      }

      // تحقق إذا كان يوجد تاريخ لإنشاء المستخدم
      addDateFilter(filters, 'updatedAt', searchConditions);

      const fieldsToDelete = ['search', 'isActive', 'updatedAt'];
      fieldsToDelete.forEach((field) => delete filters[field]);

      const finalFilter = buildFinalFilter(
        filters,
        searchConditions,
        filterConditions,
      );

      // Get paginated specializations
      const result = await paginate({
        model: this.specializationModel,
        populate: [],
        page,
        limit,
        allData,
        filter: finalFilter,
        sort: sort,
      });

      // Get all specialization IDs
      const specializationIds = result.data.map(
        (spec: SpecializationDocument) => spec._id,
      );
      console.log('specializationIds', specializationIds);
      // Get counts for each specialization
      const clinicCountMap = new Map();
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

        clinicCountMap.set(specId.toString(), clinicCount);
        doctorCountMap.set(specId.toString(), doctorCount);
      }

      // Add counts to each specialization
      result.data = result.data.map((spec: any) => {
        const specObj = spec.toObject();
        specObj['statistics'] = {
          clinics: clinicCountMap.get(spec._id.toString()) || 0,
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
        clinics: clinicCount,
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
