import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiGetResponse, paginate } from 'src/common/utils/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ClinicDocument, Clinic } from '../clinic/schemas/clinic.schema';
import {
  AppointmentDocument,
  Appointment,
} from '../appointment/schemas/appointment.schema';
import {
  MedicalRecord,
  MedicalRecordDocument,
} from '../medicalrecord/schemas/medicalrecord.schema';
import {
  ComplexDocument,
  Complex,
} from '../cliniccollection/schemas/cliniccollection.schema';
import { generateUniquePublicId } from 'src/common/utils/id-generator';
@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    @InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>, // 👈 هنا
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>, // 👈 هنا
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecordDocument>, // 👈 هنا
    @InjectModel(Complex.name)
    private cliniccollectionModel: Model<ComplexDocument>, // 👈 هنا
  ) {}

  private async checkUniqueName(name: string, clinicCollectionId: string) {
    const existingDepartment = await this.departmentModel.findOne({
      name,
      clinicCollectionId,
    });

    if (existingDepartment) {
      throw new BadRequestException(
        'A department with this name already exists in the specified Medical Complex.',
      );
    }
  }
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
    plan: string,
  ): Promise<ApiGetResponse<Department>> {
    try {
      if (
        (plan === 'complex' || plan === 'company') &&
        !createDepartmentDto.clinicCollectionId
      ) {
        throw new BadRequestException(
          'complex id is required for department plan',
        );
      }
      if (createDepartmentDto.clinicCollectionId) {
        await this.checkUniqueName(
          createDepartmentDto.name,
          createDepartmentDto.clinicCollectionId.toString(),
        );
      }

      const publicId = await generateUniquePublicId(
        this.departmentModel,
        'dep',
      );

      const newDepartment = new this.departmentModel({
        ...createDepartmentDto,
        publicId,
      });
      const savedDepartment = await newDepartment.save();
      return {
        success: true,
        message: 'Department created successfully',
        data: savedDepartment,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  async getAllDepartments(paginationDto: PaginationAndFilterDto, filters: any) {
    try {
      let { page, limit, allData, sortBy, order } = paginationDto;

      // Convert page & limit to numbers
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      // تحديد حقل الفرز الافتراضي
      const sortField: string = sortBy ?? 'id';
      const sort: Record<string, 1 | -1> = {
        [sortField]: order === 'asc' ? 1 : -1,
      };

      // إعداد شروط البحث
      const searchConditions: any[] = [];

      // تحقق إذا كان يوجد نص للبحث
      if (filters.search) {
        const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الحروف
        const clinics = await this.cliniccollectionModel
          .find({ name: regex })
          .select('_id');
        const clinicIds = clinics.map((c) => c._id.toString());
        // إضافة شروط البحث للحقول النصية والمرتبطة بالمجمع
        searchConditions.push(
          { name: regex },
          { address: regex },
          { clinicCollectionId: { $in: clinicIds } }, // البحث داخل المجمع المرتبط
        );
      }

      delete filters.search;

      const finalFilter = {
        ...filters,
        ...(searchConditions.length > 0
          ? { $and: [{ $or: searchConditions }] }
          : {}),
      };
      finalFilter.deleted = { $ne: true };
      // استخدام paginate مع populate
      const result = await paginate({
        model: this.departmentModel,
        populate: [
          { path: 'clinicCollectionId', select: 'name' },
          'specializations',
          'PIC',
        ], // الحقول المرتبطة التي سيتم تحميلها
        page,
        limit,
        allData,
        filter: finalFilter,
        sort: sort,
      });

      // إضافة عدد المرضى المرتبطين بكل قسم
      if (result.data) {
        const departments = result.data;
        const updatedDepartments = await Promise.all(
          departments.map((department) =>
            this.addStatsToDepartment(department),
          ),
        );
        result.data = updatedDepartments;
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  async addStatsToDepartment(department: any) {
    // console.log(`🔍 Department: ${department.name} (ID: ${department._id})`);

    // 1. Get clinics associated with this department only
    const clinics = await this.clinicModel
      .find({
        departmentId: department._id.toString(),
      })
      .select('_id');

    const clinicIds = clinics.map((c) => c._id.toString());
    const clinicCount = clinicIds.length;

    // console.log(`🏥 Number of clinics for the department "${department.name}": ${clinicCount}`);
    // console.log(`🏥 Clinics for department "${department.name}":`, clinicIds);

    let patientCount = 0;

    if (clinicCount > 0) {
      // 2. Get appointments related to these clinics only
      const appointments = await this.appointmentModel
        .find({
          clinic: { $in: clinicIds },
        })
        .select('_id');

      const appointmentIds = appointments.map((a) => a._id.toString());

      // console.log(`📅 Number of appointments for clinics in department "${department.name}": ${appointmentIds.length}`);
      // console.log(`📅 Appointments for department "${department.name}":`, appointmentIds);

      if (appointmentIds.length > 0) {
        // 3. Count the medical records related to these appointments only
        patientCount = await this.medicalRecordModel.countDocuments({
          appointment: { $in: appointmentIds },
        });

        // console.log(`🩺 Number of patients (medical records) in department "${department.name}": ${patientCount}`);
      }
    }

    // 4. Return department with clinic count and patient count
    return {
      ...(department.toObject?.() ?? department),
      clinicCount,
      patientCount,
    };
  }

  async getDepartmentById(id: string): Promise<ApiGetResponse<any>> {
    try {
      const department = await this.departmentModel
        .findById(id)
        .populate(['clinicCollectionId', 'specializations'])
        .exec();

      if (!department || department.deleted)
        throw new NotFoundException('Department not found or has been deleted');

      // compute clinic and patient stats from main
      const departmentWithStats = await this.addStatsToDepartment(department);

      // get full clinics (from main)
      const assignedClinics = await this.clinicModel
        .find({ departmentId: id })
        .exec();

      // get clinic names (from M-test-1)
      const clinics = await this.clinicModel
        .find({ departmentId: id })
        .select('name')
        .exec();

      const clinicCount = clinics.length;
      const countSpecializations = department.specializations.length;

      return {
        success: true,
        message: 'department retrieved successfully',
        data: {
          ...departmentWithStats,
          assignedClinics, // from main
          clinics, // from M-test-1
          clinicCount, // from M-test-1
          countSpecializations, // from M-test-1
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<ApiGetResponse<Department>> {
    try {
      const updatedDepartment = await this.departmentModel
        .findByIdAndUpdate(id, updateDepartmentDto, { new: true })
        .populate(['clinicCollectionId']);
      if (!updatedDepartment || updatedDepartment.deleted)
        throw new NotFoundException('Department not found or has been deleted');
      return {
        success: true,
        message: 'Department update successfully',
        data: updatedDepartment,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async deleteDepartment(id: string): Promise<ApiGetResponse<Department>> {
    try {
      const department = await this.departmentModel.findById(id).exec();
      if (!department || department.deleted)
        throw new NotFoundException('Department not found or has been deleted');

      department.deleted = true;
      department.name = department.name + ' (Deleted)' + department.publicId;
      const deletedDepartment = await department.save();

      return {
        success: true,
        message: 'Department marked as deleted successfully',
        data: deletedDepartment,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getCountByClinicCollectionId(
    clinicCollectionId: string,
  ): Promise<ApiGetResponse<{ count: number }>> {
    try {
      const count = await this.departmentModel
        .countDocuments({ clinicCollectionId })
        .exec();

      return {
        success: true,
        message: 'Department count retrieved successfully',
        data: { count },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
