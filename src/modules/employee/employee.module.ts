import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {EmployeeService} from './employee.service';
import {EmployeeController} from './employee.controller';
import {Employee, EmployeeSchema} from './schemas/employee.schema';

@Module({
    imports: [MongooseModule.forFeature([{name: Employee.name, schema: EmployeeSchema}])],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService], // تصدير الخدمة لاستخدامها في وحدات أخرى إذا لزم الأمر
})
export class EmployeeModule {
}
