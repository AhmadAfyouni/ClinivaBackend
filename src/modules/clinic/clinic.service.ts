import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clinic, ClinicDocument } from './schemas/clinic.schema';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { Appointment, AppointmentDocument } from '../appointment/schemas/appointment.schema';
import { MedicalRecord,MedicalRecordDocument } from '../medicalrecord/schemas/medicalrecord.schema';
@Injectable()
export class ClinicService {
  constructor(
    @InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(MedicalRecord.name) private medicalRecordModel: Model<MedicalRecordDocument>,
  ) {}
  async createClinic(
    createClinicDto: CreateClinicDto,
  ): Promise<ApiGetResponse<Clinic>> {
    const newClinic = new this.clinicModel(createClinicDto);
    const savedClinic = await newClinic.save();
    return {
      success: true,
      message: 'Clinic created successfully',
      data: savedClinic,
    };
  }

  // async getAllClinics(paginationDto: PaginationAndFilterDto, filters: any) {
  //   let { page, limit, allData, sortBy, order } = paginationDto;

  //   // Convert page & limit to numbers
  //   page = Number(page) || 1;
  //   limit = Number(limit) || 10;

  //   const sortField: string = sortBy ?? 'createdAt';
  //   const sort: Record<string, number> = {
  //     [sortField]: order === 'asc' ? 1 : -1,
  //   };
  //   const populateFields = [
  //     // { path: 'departmentId' }, // Existing field
  //     { path: 'specializations' }, // New field to populate
  //     // { path: 'insuranceCompany' }, // Another new field
  //     // Add more fields as needed
  //   ];
  //   return paginate(
  //     this.clinicModel,
  //     populateFields,
  //     page,
  //     limit,
  //     allData,
  //     filters,
  //     sort,
  //   );
  // }
  async getAllClinics(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;
  
    page = Number(page) || 1;
    limit = Number(limit) || 10;
  
    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
  
    const searchConditions: any[] = [];
    const filterConditions: any[] = [];
  
    const allowedStatuses = ['true', 'false'];
    if (filters.isActive && allowedStatuses.includes(filters.isActive)) {
      filterConditions.push({ isActive: filters.isActive });
    }
  
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
      searchConditions.push({ name: regex });
    }
  
    delete filters.search;
    delete filters.isActive;
  
    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
      ...(filterConditions.length > 0 ? { $and: filterConditions } : {})
    };
  
    const populateFields = [
      { path: 'departmentId' },
      { path: 'specializations' },
      { path: 'insuranceCompany' },
    ];
  
    const result = await paginate(
      this.clinicModel,
      populateFields,
      page,
      limit,
      allData,
      finalFilter,
      sort,
    );
  
    // إحصائيات لكل عيادة
    if (result.data) {
      const clinics = result.data;
      const updatedClinics = await Promise.all(
        clinics.map(clinic => this.addStatsToClinic(clinic))
      );
      result.data = updatedClinics;
    }
  
    return result;
  }
  async addStatsToClinic(clinic: any) {
    console.log(`🔍 Clinic: ${clinic.name} (ID: ${clinic._id})`);
  
    // 1. الحصول على المواعيد المرتبطة بهذه العيادة
    const appointments = await this.appointmentModel.find({
      clinic: clinic._id.toString(),
    }).select('_id');
  
    const appointmentIds = appointments.map(a => a._id.toString());
    const appointmentCount = appointmentIds.length;
  
  
  
    let treatedPatientCount = 0;
  
    if (appointmentCount > 0) {
      // 2. حساب عدد السجلات الطبية المرتبطة بهذه المواعيد (عدد المرضى المعالجين)
      treatedPatientCount = await this.medicalRecordModel.countDocuments({
        appointment: { $in: appointmentIds },
      });
  
      console.log(`🩺 Treated patients in clinic "${clinic.name}": ${treatedPatientCount}`);
    }
  
    // 3. إعادة العيادة مع الإحصائيات
    // const clinicObj = clinic.toObject();
   const patientstreated = {
    
     
         treatedPatientCount,
     
    };
  
    return patientstreated  ;
  }
  
  async getClinicById(id: string): Promise<ApiGetResponse<Clinic>> {
    const [clinic, patientCount] = await Promise.all([
      this.clinicModel
        .findById(id)
        .populate([
          'departmentId',
          'specializations',
          'insuranceCompany'
        ]),
      this.appointmentModel.countDocuments({ clinic: id })
    ]);

    if (!clinic) throw new NotFoundException('Clinic not found');

    const clinicObj = clinic.toObject();
    clinicObj['patientCount'] = patientCount;

    return {
      success: true,
      message: 'Clinic retrieved successfully',
      data: clinicObj,
    };
  }

  async updateClinic(
    id: string,
    updateClinicDto: UpdateClinicDto,
  ): Promise<ApiGetResponse<Clinic>> {
    const updatedClinic = await this.clinicModel
      .findByIdAndUpdate(id, updateClinicDto, { new: true })
      .populate(['departmentId']);
    if (!updatedClinic) throw new NotFoundException('Clinic not found');
    return {
      success: true,
      message: 'Clinic update successfully',
      data: updatedClinic,
    };
  }

  async deleteClinic(id: string): Promise<ApiGetResponse<Clinic>> {
    const deletedClinic = await this.clinicModel.findByIdAndDelete(id);
    if (!deletedClinic) throw new NotFoundException('Clinic not found');
    return {
      success: true,
      message: 'Clinic remove successfully',
      data: {} as Clinic,
    };
  }
  async getCountByClinicCollectionId(
    clinicCollectionId: string,
  ): Promise<ApiGetResponse<{ count: number }>> {
    const clinics = await this.clinicModel
      .find()
      .populate({
        path: 'departmentId',
        select: 'clinicCollectionId',
        match: { clinicCollectionId: clinicCollectionId },
      })
      .lean();
    const count = clinics.filter(
      (clinic) => clinic.departmentId !== null,
    ).length;

    return {
      success: true,
      message: 'clinic count  in Clinic Collection retrieved successfully',
      data: { count },
    };
  }

  async getClinicPatientCount(clinicId: string): Promise<ApiGetResponse<{ patientCount: number }>> {
    // Get unique patient count from appointments for this clinic
    const uniquePatients = await this.appointmentModel.distinct('patientId', {
      clinicId: clinicId,
    });

    return {
      success: true,
      message: 'Patient count retrieved successfully',
      data: { patientCount: uniquePatients.length },
    };
  }
}
