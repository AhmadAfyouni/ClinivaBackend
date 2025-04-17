import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clinic, ClinicDocument } from './schemas/clinic.schema';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { Appointment, AppointmentDocument } from '../appointment/schemas/appointment.schema';

@Injectable()
export class ClinicService {
  constructor(
    @InjectModel(Clinic.name) private clinicModel: Model<ClinicDocument>,
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
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

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const sortField: string = sortBy ?? 'createdAt';
    const sort: Record<string, number> = {
      [sortField]: order === 'asc' ? 1 : -1,
    };
    const searchConditions: any[] = [];
    const filterConditions: any[] = [];
    const allowedStatuses = ['true', 'false'];
    if (filters.isActive) {
      if (allowedStatuses.includes(filters.isActive)) {
        filterConditions.push({ isActive: filters.isActive });
      } else {
        throw new Error(`Invalid status value. Allowed values: ${allowedStatuses.join(', ')}`);
      }
    }
    if (filters.search){
      const regex = new RegExp(filters.search, 'i');
      searchConditions.push(
        { name: regex },
      )
    }
    delete filters.search;
    delete filters.isActive;
    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
      ...(filterConditions.length > 0 ? { $and: filterConditions } : {})
    };
    // Specify the fields to populate
    const populateFields = [
      { path: 'departmentId' }, // Existing field
      { path: 'specializations' }, // New field to populate
      { path: 'insuranceCompany' }, // Another new field
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

    if (result.success && result.data && result.data.length > 0) {
      // Get all clinic IDs
      const clinicIds = result.data.map(clinic => clinic._id.toString());
      // console.log('clinicIds', clinicIds);
      // Get comprehensive statistics for all clinics in a single aggregation
      const clinicStats = await this.appointmentModel.aggregate([
        { 
          $match: { 
            clinic: { $in: clinicIds } 
          } 
        },
        {
          $group: {
            _id: '$clinic',
            totalAppointments: { $sum: 1 },
            activeAppointments: { 
              $sum: { 
                $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] 
              } 
            },
            uniquePatients: { $addToSet: '$patient' },
            byStatus: {
              $push: '$status'
            },
            // Group appointments by date
            appointmentsByDate: {
              $push: {
                date: '$datetime',
                status: '$status'
              }
            }
          }
        },
        {
          $project: {
            totalAppointments: 1,
            activeAppointments: 1,
            uniquePatientCount: { $size: '$uniquePatients' },
            statusCounts: {
              scheduled: { 
                $size: { 
                  $filter: { 
                    input: '$byStatus', 
                    cond: { $eq: ['$$this', 'scheduled'] } 
                  } 
                } 
              },
              completed: { 
                $size: { 
                  $filter: { 
                    input: '$byStatus', 
                    cond: { $eq: ['$$this', 'completed'] } 
                  } 
                } 
              },
              cancelled: { 
                $size: { 
                  $filter: { 
                    input: '$byStatus', 
                    cond: { $eq: ['$$this', 'cancelled'] } 
                  } 
                } 
              }
            },
            // Get appointments for last 30 days
            recentActivity: {
              $filter: {
                input: '$appointmentsByDate',
                as: 'appt',
                cond: { 
                  $gte: ['$$appt.date', { 
                    $dateSubtract: { 
                      startDate: '$$NOW', 
                      unit: 'day', 
                      amount: 30 
                    } 
                  }] 
                }
              }
            }
          }
        }
      ]);

      // Create a map of clinic ID to statistics
      const statsMap = new Map(
        clinicStats.map(item => [item._id.toString(), {
          totalAppointments: item.totalAppointments,
          activeAppointments: item.activeAppointments,
          uniquePatientCount: item.uniquePatientCount,
          statusCounts: item.statusCounts,
          recentActivity: item.recentActivity
        }])
      );

      // Add statistics to clinic objects
      result.data = result.data.map(clinic => {
        const clinicObj = clinic.toObject();
        const stats = statsMap.get(clinic._id.toString()) || {
          totalAppointments: 0,
          activeAppointments: 0,
          uniquePatientCount: 0,
          statusCounts: { scheduled: 0, completed: 0, cancelled: 0 },
          recentActivity: []
        };
        
        clinicObj['statistics'] = {
          appointments: {
            total: stats.totalAppointments,
            active: stats.activeAppointments,
            byStatus: stats.statusCounts
          },
          patients: {
            total: stats.uniquePatientCount
          },
          recentActivity: stats.recentActivity
        };
        
        return clinicObj;
      });
    }

    return result;
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
