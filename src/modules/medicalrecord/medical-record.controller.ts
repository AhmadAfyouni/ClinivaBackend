import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {MedicalRecordService} from './medical-record.service';
import {MedicalRecord} from "./schemas/medicalrecord.schema";
import {CreateMedicalRecordDto} from "./dto/create-medical-record.dto";
import {UpdateMedicalRecordDto} from "./dto/update-medical-record.dto";
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Controller('medicalrecords')
export class MedicalRecordController {
    constructor(private readonly medicalRecordService: MedicalRecordService) {
    }

    @Post()
    async createMedicalRecord(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
        return this.medicalRecordService.createMedicalRecord(createMedicalRecordDto);
    }



        @Get()
        async getAllMedicalRecords(@Query() paginationDto: PaginationAndFilterDto, @Query() queryParams: any) {
            const { page, limit, allData, sortBy, order, ...filters } = queryParams;
    
            return this.medicalRecordService.getAllMedicalRecords(paginationDto, filters);
        }

    @Get(':id')
    async getMedicalRecordById(@Param('id') id: string) {
        return this.medicalRecordService.getMedicalRecordById(id);
    }

    @Put(':id')
    async updateMedicalRecord(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
        return this.medicalRecordService.updateMedicalRecord(id, updateMedicalRecordDto);
    }

    @Delete(':id')
    async deleteMedicalRecord(@Param('id') id: string) {
        return this.medicalRecordService.deleteMedicalRecord(id);
        
    }
}
