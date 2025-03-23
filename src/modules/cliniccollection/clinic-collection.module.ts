import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ClinicCollectionService} from './clinic-collection.service';
import {ClinicCollectionController} from './clinic-collection.controller';
import {ClinicCollection, ClinicCollectionSchema} from "./schemas/cliniccollection.schema";
import { UserModule } from '../user/user.module';

@Module({
    imports: [MongooseModule.forFeature([{name: ClinicCollection.name, schema: ClinicCollectionSchema}])],
    controllers: [ClinicCollectionController],
    providers: [ClinicCollectionService],
    exports: [ClinicCollectionService]
})
export class ClinicCollectionModule {
}
