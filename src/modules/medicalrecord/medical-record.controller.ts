import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {MedicalRecordService} from './medical-record.service';
import {MedicalRecord} from "./schemas/medicalrecord.schema";
import {CreateMedicalRecordDto} from "./dto/create-medical-record.dto";
import {UpdateMedicalRecordDto} from "./dto/update-medical-record.dto";

@Controller('medicalrecords')
export class MedicalRecordController {
    constructor(private readonly medicalRecordService: MedicalRecordService) {
    }

    @Post()
    async createMedicalRecord(@Body() createMedicalRecordDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
        return this.medicalRecordService.createMedicalRecord(createMedicalRecordDto);
    }

    @Get()
    async getAllMedicalRecords(): Promise<MedicalRecord[]> {
        return this.medicalRecordService.getAllMedicalRecords();
    }

    @Get(':id')
    async getMedicalRecordById(@Param('id') id: string): Promise<MedicalRecord> {
        return this.medicalRecordService.getMedicalRecordById(id);
    }

    @Put(':id')
    async updateMedicalRecord(@Param('id') id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<MedicalRecord> {
        return this.medicalRecordService.updateMedicalRecord(id, updateMedicalRecordDto);
    }

    @Delete(':id')
    async deleteMedicalRecord(@Param('id') id: string): Promise<void> {
        return this.medicalRecordService.deleteMedicalRecord(id);
    }
}
