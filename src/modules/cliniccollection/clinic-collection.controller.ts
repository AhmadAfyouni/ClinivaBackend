import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ClinicCollectionService } from './clinic-collection.service';
import {CreateClinicCollectionDto} from "./dto/create-clinic-collection.dto";
import {UpdateClinicCollectionDto} from "./dto/update-clinic-collection.dto";

@Controller('cliniccollections')
export class ClinicCollectionController {
    constructor(private readonly clinicCollectionService: ClinicCollectionService) {}

    @Post()
    async createClinicCollection(@Body() createClinicCollectionDto: CreateClinicCollectionDto) {
        return this.clinicCollectionService.createClinicCollection(createClinicCollectionDto);
    }

    @Get()
    async getAllClinicCollections() {
        return this.clinicCollectionService.getAllClinicCollections();
    }

    @Get(':id')
    async getClinicCollectionById(@Param('id') id: string) {
        return this.clinicCollectionService.getClinicCollectionById(id);
    }

    @Put(':id')
    async updateClinicCollection(@Param('id') id: string, @Body() updateClinicCollectionDto: UpdateClinicCollectionDto) {
        return this.clinicCollectionService.updateClinicCollection(id, updateClinicCollectionDto);
    }

    @Delete(':id')
    async deleteClinicCollection(@Param('id') id: string) {
        return this.clinicCollectionService.deleteClinicCollection(id);
    }
}
