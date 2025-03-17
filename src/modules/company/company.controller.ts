import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {CompanyService} from './company.service';
import {Company} from './schemas/company.schema';
import {CreateCompanyDto} from "./dto/create-company.dto";
import {UpdateCompanyDto} from "./dto/update-company.dto";

@Controller('companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {
    }

    @Post()
    async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
        return this.companyService.create(createCompanyDto);
    }

    @Get()
    async findAll(): Promise<Company[]> {
        return this.companyService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Company> {
        return this.companyService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        return this.companyService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.companyService.remove(id);
    }
}
