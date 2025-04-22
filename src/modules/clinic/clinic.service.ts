import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clinic, ClinicDocument } from './schemas/clinic.schema';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ApiGetResponse, applyBooleanFilter, applyModelFilter, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import {
  Appointment,
  AppointmentDocument,
} from '../appointment/schemas/appointment.schema';
import {
  MedicalRecord,
  MedicalRecordDocument,
} from '../medicalrecord/schemas/medicalrecord.schema';
import { SpecializationDocument,Specialization } from '../specialization/schemas/specialization.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
import { Employee, EmployeeDocument } from '../employee/schemas/employee.schema';

@Injectable()
export class ClinicService {
  constructor(
    @InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecordDocument>,
    @InjectModel(Specialization.name)
    private specializationModel: Model<SpecializationDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}
  async createClinic(
    createClinicDto: CreateClinicDto,
  ): Promise<ApiGetResponse<Clinic>> {
   const publicId = await generateUniquePublicId(this.clinicModel, 'cli');
    
    const newClinic = new this.clinicModel({
      ...createClinicDto,
      publicId});
    const savedClinic = await newClinic.save();
    return {
      success: true,
      message: 'Clinic created successfully',
      data: savedClinic,
    };
  }
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
    let specializationIds: string[] = [];
   await applyBooleanFilter(filters, 'isActive', filterConditions)

   if (filters.search) {
    const regex = new RegExp(filters.search, 'i');
    searchConditions.push({ name: regex });
  
    const specializations = await this.specializationModel.find({ name: regex }).select('_id');
    specializationIds = specializations.map(spec => spec._id.toString());
  
    if (specializationIds.length) {
      searchConditions.push({ specializations: { $in: specializationIds } });
    }
  }
  
   
       await applyModelFilter(
           this.specializationModel,
           filters,
           'specializationName',
           'name',
           'specializations',
           filterConditions,
           page,
           limit
         );
     
         if (filters.clinicsId) {
          filters._id = filters.clinicsId; 
          delete filters.clinicsId;
        }
         const fieldsToDelete = ['search', 'isActive','specializationName',];
         fieldsToDelete.forEach(field => delete filters[field])
         const finalFilter: any = { $and: [] };

         if (Object.keys(filters).length > 0) {
           finalFilter.$and.push(filters);
         }
         
         if (searchConditions.length > 0) {
           finalFilter.$and.push({ $or: searchConditions });
         }
         
         if (filterConditions.length > 0) {
           finalFilter.$and.push(...filterConditions);
         }
         
         if (finalFilter.$and.length === 0) {
           delete finalFilter.$and;
         }
 
    const populateFields = [
      { path: 'departmentId' },
      { path: 'specializations' ,select:'name'},
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
        clinics.map((clinic) => this.addStatsToClinic(clinic)),
      );
      result.data = updatedClinics;
    }

    return result;
  }
  async addStatsToClinic(clinic: any) {
    console.log(`🔍 Clinic: ${clinic.name} (ID: ${clinic._id})`);

    // 1. الحصول على المواعيد المرتبطة بهذه العيادة
    const appointments = await this.appointmentModel
      .find({
        clinic: clinic._id.toString(),
      })
      .select('_id');

    const appointmentIds = appointments.map((a) => a._id.toString());
    const appointmentCount = appointmentIds.length;

    let treatedPatientCount = 0;

    if (appointmentCount > 0) {
      // 2. حساب عدد السجلات الطبية المرتبطة بهذه المواعيد (عدد المرضى المعالجين)
      treatedPatientCount = await this.medicalRecordModel.countDocuments({
        appointment: { $in: appointmentIds },
      });

      console.log(
        `🩺 Treated patients in clinic "${clinic.name}": ${treatedPatientCount}`,
      );
    }

    return {
      ...(clinic.toObject?.() ?? clinic),
      treatedPatientCount,
    };
  }

  async getEmployeeCountByDoctorType(clinicId: string, doctorType: string = 'Doctor'): Promise<number> {
    const count = await this.employeeModel.countDocuments({
      clinics: clinicId,
      employeeType: doctorType
    });
    return count;
  }
  async getClinicById(id: string): Promise<ApiGetResponse<Clinic>> {
    
    try {
    
    const [clinic, patientCount, employeeCounts] = await Promise.all([
      this.clinicModel
        .findById(id)

        .populate([
          'departmentId',
          'specializations',
          'insuranceCompany'
        ]),
      this.appointmentModel.countDocuments({ clinic: id }),
      Promise.all([
        this.getEmployeeCountByDoctorType( id,  'Doctor' ),
        this.getEmployeeCountByDoctorType( id,  'Nurse' ),
        this.getEmployeeCountByDoctorType( id,  'Technician' ),
        this.getEmployeeCountByDoctorType( id,  'Administrative' )
      ])
    ]);

    if (!clinic) throw new NotFoundException('Clinic not found');

    const clinicObj = clinic.toObject();
    clinicObj['patientCount'] = patientCount;
    clinicObj['employeeCounts'] = {
      doctors: employeeCounts[0],
      nurses: employeeCounts[1],
      technicians: employeeCounts[2],
      administrative: employeeCounts[3],
      total: employeeCounts.reduce((a, b) => a + b, 0)
    };

    return {
      success: true,
      message: 'Clinic retrieved successfully',
      data: clinicObj,
    };}
    catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve clinic');
    }
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

  async getClinicPatientCount(
    clinicId: string,
  ): Promise<ApiGetResponse<{ patientCount: number }>> {
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
