import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company, CompanySchema } from './schemas/company.schema';
import { EmployeeModule } from '../employee/employee.module';
import { Employee, EmployeeSchema } from '../employee/schemas/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    forwardRef(() => EmployeeModule),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
