import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company, CompanySchema } from './schemas/company.schema';
import { User, UserSchema } from 'src/modules/user/schemas/user.schema';
import { UserModule } from 'src/modules/user/user.module';
import { EmployeeModule } from '../employee/employee.module'; // Import EmployeeModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    EmployeeModule, // Add EmployeeModule to imports
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
