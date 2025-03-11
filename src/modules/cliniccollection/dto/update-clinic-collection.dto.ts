import {PartialType} from "@nestjs/mapped-types";
import {CreateClinicCollectionDto} from "./create-clinic-collection.dto";


export class UpdateClinicCollectionDto extends PartialType(CreateClinicCollectionDto) { }
