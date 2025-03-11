import {PartialType} from "@nestjs/mapped-types";
import {CreateDepartmentDto} from "./update-department.dto";

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) { }
