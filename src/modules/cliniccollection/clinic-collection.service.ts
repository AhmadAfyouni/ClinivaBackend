import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ClinicCollection, ClinicCollectionDocument} from "./schemas/cliniccollection.schema";
import {UpdateClinicCollectionDto} from "./dto/update-clinic-collection.dto";
import {CreateClinicCollectionDto} from "./dto/create-clinic-collection.dto";
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { ApiResponse, paginate } from 'src/common/utlis/paginate';
import { UserService } from '../user/user.service';

@Injectable()
export class ClinicCollectionService {
    constructor(
        @InjectModel(ClinicCollection.name) private clinicCollectionModel: Model<ClinicCollectionDocument>
    // , private userService: UserService,
)
 {
    }

    async createClinicCollection(createClinicCollectionDto: CreateClinicCollectionDto): Promise<ApiResponse<ClinicCollection>> {
        const newClinicCollection = new this.clinicCollectionModel(createClinicCollectionDto);
        const savedClinicCollection = await newClinicCollection.save(); 
        return {
            success:true,
            message: 'Company created successfully',
            data: savedClinicCollection};
    }





    async getAllClinicCollections(paginationDto: PaginationAndFilterDto, filters: any) {
        let { page, limit, allData, sortBy, order } = paginationDto;

        // Convert page & limit to numbers
        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const sortField: string = sortBy ?? 'createdAt';
        const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
        
        return paginate(this.clinicCollectionModel,['companyId','users'], page, limit, allData, filters, sort);
    }

    async getClinicCollectionById(id: string): Promise<ApiResponse<ClinicCollection>> {
        const clinicCollection = await this.clinicCollectionModel.findById(id).populate(['companyId',  'users']);
       
        console.log(clinicCollection)
        if (!clinicCollection) throw new NotFoundException('Clinic Collection not found');
        
        // const  user=await this.userService.getUserByClinicCollectionId(id)

        // console.log(clinicCollection)
        //  if (user) {
        //     clinicCollection['user'] = user;  
        // } else {
        //     clinicCollection['user'] = "null"; 
        // }
       
        return {
            success:true,
            message: 'clinic Collection retrieved successfully',
            data:clinicCollection,} ;
    }

    async updateClinicCollection(id: string, updateClinicCollectionDto: UpdateClinicCollectionDto): Promise<ApiResponse<ClinicCollection>> {
        const updatedClinicCollection = await this.clinicCollectionModel.findByIdAndUpdate(id, updateClinicCollectionDto, {new: true}).populate(['companyId',  ]);
        if (!updatedClinicCollection) throw new NotFoundException('Clinic Collection not found');
    
        return {success:true,
            message: 'Clinic Collection update successfully',
            data:updatedClinicCollection,};
    }

    async deleteClinicCollection(id: string): Promise<ApiResponse<ClinicCollection>> {
        const deletedClinicCollection = await this.clinicCollectionModel.findByIdAndDelete(id);
        if (!deletedClinicCollection) throw new NotFoundException('Clinic Collection not found');
        return {
            success:true,
            message: 'Clinic Collection remove successfully',
        }
    }
}
