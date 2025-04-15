import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ClinicDocument,Clinic } from '../clinic/schemas/clinic.schema';
@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
    @InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>, // 👈 هنا
  
  ) {}

  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<ApiGetResponse<Department>> {
    const newDepartment = new this.departmentModel(createDepartmentDto);
    const savedDepartment = await newDepartment.save();
    return {
      success: true,
      message: 'Department created successfully',
      data: savedDepartment,
    };
  }
  async getAllDepartments(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;
  
    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;
  
    // تحديد حقل الفرز الافتراضي
    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
  
    // إعداد شروط البحث
    const searchConditions: any[] = [];
  
    // تحقق إذا كان يوجد نص للبحث
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الحروف
  
      // إضافة شروط البحث للحقول النصية والمرتبط بالمجمع
      searchConditions.push(
        { name: regex },
        { address: regex },
        { 'clinicCollectionId.name': regex } // البحث داخل المجمع المرتبط
      );
    }
  
    // إزالة مفتاح البحث من الفلاتر قبل تمريرها
    delete filters.search;
  
    // دمج الفلاتر مع شروط البحث
    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
    };
  
    // استخدام paginate مع populate
    const result = await paginate(
      this.departmentModel,
      ['clinicCollectionId', 'specializations'], // الحقول المرتبطة التي سيتم تحميلها
      page,
      limit,
      allData,
      finalFilter,
      sort,
    );
  
    // إضافة عدد العيادات المرتبطة بكل قسم
    if (result.data) {
      const departments = result.data;
      const updatedDepartments = await Promise.all(
        departments.map((department) => this.addClinicCounts(department)), // إضافة عدد العيادات
      );
      result.data = updatedDepartments;
    }
  
    return result;
  }
  
  async addClinicCounts(department: any) {
    // جلب عدد العيادات المرتبطة بالقسم
    const clinicCount = await this.clinicModel.countDocuments({
      departmentId: department._id,
    });
  
    // إرجاع البيانات مع إضافة عدد العيادات
    return {
      ...department.toObject?.() ?? department,
      clinicCount, // عدد العيادات المرتبطة
    };
  }
  
  async getDepartmentById(id: string): Promise<ApiGetResponse<Department>> {
    const department = await this.departmentModel
      .findById(id)
      .populate(['clinicCollectionId', 'specializations']);
    if (!department) throw new NotFoundException('Department not found');
    return {
      success: true,
      message: 'department retrieved successfully',
      data: department,
    };
  }

  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<ApiGetResponse<Department>> {
    const updatedDepartment = await this.departmentModel
      .findByIdAndUpdate(id, updateDepartmentDto, { new: true })
      .populate(['clinicCollectionId']);
    if (!updatedDepartment) throw new NotFoundException('Department not found');
    return {
      success: true,
      message: 'Department update successfully',
      data: updatedDepartment,
    };
  }

  async deleteDepartment(id: string): Promise<ApiGetResponse<Department>> {
    const deletedDepartment = await this.departmentModel.findByIdAndDelete(id);
    if (!deletedDepartment) throw new NotFoundException('Department not found');
    return {
      success: true,
      message: 'Department remove successfully',
      data: {} as Department,
    };
  }

  async getCountByClinicCollectionId(
    clinicCollectionId: string,
  ): Promise<ApiGetResponse<{ count: number }>> {
    const count = await this.departmentModel
      .countDocuments({ clinicCollectionId })
      .exec();

    return {
      success: true,
      message: 'Department count retrieved successfully',
      data: { count },
    };
  }
}
