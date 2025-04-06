import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MedicalRecord, MedicalRecordDocument } from './schemas/medicalrecord.schema';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { ApiResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class MedicalRecordService {
  constructor(@InjectModel(MedicalRecord.name) private medicalRecordModel: Model<MedicalRecordDocument>) {
  }

  async createMedicalRecord(createMedicalRecordDto: CreateMedicalRecordDto): Promise<ApiResponse<MedicalRecord>> {
    const newRecord = new this.medicalRecordModel(createMedicalRecordDto);
    const savedRecord = await newRecord.save();
    return {
      success: true,
      message: 'Medical Record created successfully',
      data: savedRecord,
    };

  }

  async getAllMedicalRecords(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
    return paginate(this.medicalRecordModel, ['appointment'], page, limit, allData, filters, sort);
  }

  async getMedicalRecordById(id: string): Promise<ApiResponse<MedicalRecord>> {
    const record = await this.medicalRecordModel.findById(id).populate('appointment').exec();
    if (!record) throw new NotFoundException('Medical Record not found');
    return {
      success: true,
      message: 'Medical Record retrieved successfully',
      data: record,
    };
  }

  async updateMedicalRecord(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<ApiResponse<MedicalRecord>> {
    const updatedRecord = await this.medicalRecordModel.findByIdAndUpdate(id, updateMedicalRecordDto, { new: true }).exec();
    if (!updatedRecord) throw new NotFoundException('Medical Record not found');
    return {
      success: true,
      message: 'Medical Record update successfully',
      data: updatedRecord,
    };
  }

  async deleteMedicalRecord(id: string): Promise<ApiResponse<MedicalRecord>> {
    const deletedRecord = await this.medicalRecordModel.findByIdAndDelete(id).exec();
    if (!deletedRecord) throw new NotFoundException('Medical Record not found');
    return {
      success: true,
      message: 'Medical Record remove successfully',
    };
  }

  async getMedicalRecordByPatientId (patientId: string): Promise<ApiResponse<MedicalRecord[]>> {
    const medicalRecords = await this.medicalRecordModel.find({})
      .populate({
        path: 'appointment',
        match: { patient: patientId },  
      })
      .exec();
  
    const filteredMedicalRecords = medicalRecords.filter(record => record.appointment);
    return {
      success: true,
      message: 'Patient by medical record retrieved successfully',
      data: filteredMedicalRecords,
    };
  }

  async getLastVisitByPatientId(patientId: string): Promise<ApiResponse<Date | null>> {
    const medicalRecord = await this.medicalRecordModel.findOne({})
      .populate({
        path: 'appointment',
        match: { patient: patientId },  
      })
      .where('startTime').ne(null)  // تأكد من أن startTime موجود
      .sort({ startTime: -1 }) 
      .exec();
  
    return {
      success: true,
      message: 'Last Visit retrieved successfully',
      data: medicalRecord ? medicalRecord.startTime : null, 
    };
  }
  
  async getCountPatientsByDoctorId(doctorId: string): Promise<ApiResponse<any>> {
    const medicalRecords = await this.medicalRecordModel.find()
      .populate({
        path: 'appointment',
        select: '_id patient doctor',
        match: { doctor: doctorId },
        populate: {
          path: 'patient',
          select: '_id', // نختصرها على حقل _id فقط لأننا لا نحتاج باقي البيانات
        },
      }).select('appointment _id')
      .lean() 
      .exec();
      const filteredRecords1 = medicalRecords.filter(record => record.appointment !== null);
      const uniquePatients = new Set();
      const filteredRecords = filteredRecords1.filter(record => {
        const appointment = record.appointment as unknown as { patient: { _id: string } } | null;
      
        if (appointment && appointment.patient && !uniquePatients.has(appointment.patient._id)) {
          uniquePatients.add(appointment.patient._id);
          return true;
        }
        return false;  });
    return {
      success: true,
      message: 'Patient count for the doctor retrieved successfully',
      data: { count: filteredRecords.length },
    };
  }
  async getPatientsByDoctorId(doctorId: string): Promise<ApiResponse<any>> {
    const medicalRecords = await this.medicalRecordModel.find()
    .populate({
      path: 'appointment',
      select: '_id patient doctor',
      match: { doctor: doctorId },
      populate: {
        path: 'patient',
      },
    }).select('appointment _id')
    .lean() 
    .exec();
  
      const filteredRecords1 = medicalRecords.filter(record => record.appointment !== null);
      const uniquePatients = new Set();
      const filteredRecords = filteredRecords1.filter(record => {
        const appointment = record.appointment as unknown as { patient: { _id: string } } | null;
      
        if (appointment && appointment.patient && !uniquePatients.has(appointment.patient._id)) {
          uniquePatients.add(appointment.patient._id);
          return true;
        }
        return false;  });
    return {
      success: true,
      message: 'Patients retrieved successfully',
      data: filteredRecords,
    };
  }

  async getPatientsCountByDepartment(departmentId: string): Promise<ApiResponse<any>> {
  const medicalRecords = await this.medicalRecordModel.find()
    .populate({
      path: 'appointment',
      select: '_id patient clinic', // جلب الحقول الخاصة بالعيادة والمريض
      populate: [{
        path: 'patient',
      },{
        path: 'clinic',
        select: '_id departmentId', // نضيف الاسم أو أي بيانات أخرى للمريض حسب الحاجة
        match: { 'departmentId': departmentId }, // تصفية المواعيد التي تتبع القسم المعين
      },],
    })
    .select('appointment _id')
    .lean()
    .exec();

  const filteredRecords = medicalRecords.filter(record => 
    record.appointment && 
    (record.appointment as any).clinic && 
    (record.appointment as any).clinic.departmentId   );

    const uniquePatients = new Set();
  const patients = filteredRecords.filter(record => {
  // تحقق من وجود المريض و العيادة قبل الوصول إليهم
  const appointment = record.appointment as any;  // تحويل إلى any لتجنب الأخطاء النوعية
  const patient = appointment?.patient;
  
  // التحقق من وجود المريض ووجود _id للمريض
  const patientId = patient ? patient._id?.toString() : null;
  
  if (patientId && !uniquePatients.has(patientId)) {
    uniquePatients.add(patientId);
    return true;
  }
  return false;
});

  return {
    success: true,
    message: 'Patients count for the department retrieved successfully',
    data: { count:patients.length},
  };
}

}

