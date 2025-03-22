import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Department, DepartmentDocument} from './schemas/department.schema';
import {CreateDepartmentDto} from "./dto/create-department.dto";
import {UpdateDepartmentDto} from "./dto/update-department.dto";
import { ApiResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class DepartmentService {
    constructor(@InjectModel(Department.name) private departmentModel: Model<DepartmentDocument>) {
    }

    async createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<ApiResponse<Department>> {
        const newDepartment = new this.departmentModel(createDepartmentDto);
        const savedDepartment = await newDepartment.save();
        return {
            success:true,
            message: 'Department created successfully',
            data: savedDepartment};
    }
    

        async getAllDepartments(paginationDto: PaginationAndFilterDto, filters: any) {
            let { page, limit, allData, sortBy, order } = paginationDto;
    
            // Convert page & limit to numbers
            page = Number(page) || 1;
            limit = Number(limit) || 10;
    
            const sortField: string = sortBy ?? 'createdAt';
            const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
            return paginate(this.departmentModel,['clinicCollectionId'], page, limit, allData, filters, sort);
        }

    async getDepartmentById(id: string): Promise<ApiResponse<Department>> {
        const department = await this.departmentModel.findById(id).populate(['clinicCollectionId',  ]);
        if (!department) throw new NotFoundException('Department not found');
        return {
            success:true,
            message: 'department retrieved successfully',
            data:department,} ;
    }

    async updateDepartment(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<ApiResponse<Department>> {
        const updatedDepartment = await this.departmentModel.findByIdAndUpdate(id, updateDepartmentDto, {new: true}).populate(['clinicCollectionId',  ]);
        if (!updatedDepartment) throw new NotFoundException('Department not found');
        return {success:true,
            message: 'Department update successfully',
            data:updatedDepartment,};
    }

    async deleteDepartment(id: string): Promise<ApiResponse<Department>> {
        const deletedDepartment = await this.departmentModel.findByIdAndDelete(id);
        if (!deletedDepartment) throw new NotFoundException('Department not found');
        return {
            success:true,
            message: 'Department remove successfully',
        }
    }
}
