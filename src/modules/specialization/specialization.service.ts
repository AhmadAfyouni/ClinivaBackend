import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Specialization,
  SpecializationDocument,
} from './schemas/specialization.schema';
import { Clinic, ClinicDocument } from '../clinic/schemas/clinic.schema';
import { Employee, EmployeeDocument } from '../employee/schemas/employee.schema';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { PaginationAndFilterDto } from '../../common/dtos/pagination-filter.dto';
import { addDateFilter, ApiGetResponse, applyBooleanFilter, buildFinalFilter, paginate } from 'src/common/utlis/paginate';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
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
    const publicId = await generateUniquePublicId(this.specializationModel, 'sp');
    const newSpecialization = new this.specializationModel({
      ...createSpecializationDto,
      publicId
    });
    const savedSpecialization = await newSpecialization.save();
    return {
      success: true,
      message: 'Specialization created successfully',
      data: savedSpecialization,
    };
  }

  async getAllSpecializations(
    paginationDto: PaginationAndFilterDto,
    filters: any,
  ) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
    
    const searchConditions: any[] = [];
    const filterConditions: any[] = [];
  await applyBooleanFilter(filters, 'isActive', filterConditions)
  // تحقق إذا كان يوجد نص للبحث في الحقول النصية (name, email)
  if (filters.search) {
    const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الأحرف

    // إضافة شروط البحث للحقول النصية
    searchConditions.push(
      { name: regex },         // البحث في الحقل name
  
    );
  }
  
    // تحقق إذا كان يوجد تاريخ لإنشاء المستخدم
  addDateFilter(filters, 'updatedAt', searchConditions);
  
    const fieldsToDelete = ['search', 'isActive','updatedAt'];
    fieldsToDelete.forEach(field => delete filters[field]);
    
    const finalFilter= buildFinalFilter(filters, searchConditions, filterConditions);
   
    // Get paginated specializations
    const result = await paginate(
      this.specializationModel,
      [],
      page,
      limit,
      allData,
      finalFilter,
      sort,
    );

    // Get all specialization IDs
    const specializationIds = result.data.map((spec: SpecializationDocument) => spec._id);
    console.log("specializationIds", specializationIds);
    // Get counts for each specialization
    const clinicCountMap = new Map();
    const doctorCountMap = new Map();

    // Process each specialization ID sequentially
    for (const specId of specializationIds as Types.ObjectId[]) {
      const [clinicCount, doctorCount] = await Promise.all([
        // Count clinics for this specialization
        this.clinicModel.countDocuments({
          specializations: specId.toString()
        }),
        // Count doctors for this specialization
        this.employeeModel.countDocuments({
          specializations: specId.toString(),
          employeeType: 'Doctor'
        })
      ]);

      console.log(`Counts for specialization ${specId}:`, { clinics: clinicCount, doctors: doctorCount });
      clinicCountMap.set(specId.toString(), clinicCount);
      doctorCountMap.set(specId.toString(), doctorCount);
    }

    // Add counts to each specialization
    result.data = result.data.map((spec: any) => {
      const specObj = spec.toObject();
      specObj['statistics'] = {
        clinics: clinicCountMap.get(spec._id.toString()) || 0,
        doctors: doctorCountMap.get(spec._id.toString()) || 0
      };
      return specObj;
    });

    return result;
  }

  async getSpecializationById(
    id: string,
  ): Promise<ApiGetResponse<Specialization>> {
    const specialization = await this.specializationModel.findById(id).exec();
    if (!specialization)
      throw new NotFoundException('Specialization not found');

    // Get clinic and doctor counts in parallel
    console.log('Searching for specialization counts with ID:', id);
    const [clinicCount, doctorCount] = await Promise.all([
      // Count clinics
      this.clinicModel.countDocuments({
        specializations: id
      }),
      // Count doctors
      this.employeeModel.countDocuments({
        specializations: id,
        employeeType: 'Doctor'
      })
    ]);

    console.log('Found counts:', { clinics: clinicCount, doctors: doctorCount });
    const specObj = specialization.toObject();
    specObj['statistics'] = {
      clinics: clinicCount,
      doctors: doctorCount
    };

    return {
      success: true,
      message: 'Specialization retrieved successfully',
      data: specObj,
    };
  }

  async updateSpecialization(
    id: string,
    updateSpecializationDto: UpdateSpecializationDto,
  ): Promise<ApiGetResponse<Specialization>> {
    const updatedSpecialization = await this.specializationModel
      .findByIdAndUpdate(id, updateSpecializationDto, { new: true })
      .exec();
    if (!updatedSpecialization)
      throw new NotFoundException('Specialization not found');

    return {
      success: true,
      message: 'Specialization updated successfully',
      data: updatedSpecialization,
    };
  }

  async deleteSpecialization(
    id: string,
  ): Promise<ApiGetResponse<Specialization>> {
    const deletedSpecialization = await this.specializationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedSpecialization)
      throw new NotFoundException('Specialization not found');
    return {
      success: true,
      message: 'Specialization removed successfully',
      data: {} as Specialization,
    };
  }
}
