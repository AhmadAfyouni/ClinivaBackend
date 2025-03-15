import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {CompanyService} from './company.service';
import {CompanyController} from './company.controller';
import {Company, CompanySchema} from './schemas/company.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: Company.name, schema: CompanySchema}])],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService], // في حال أردنا استخدامه في وحدات أخرى
})
export class CompanyModule {
}
