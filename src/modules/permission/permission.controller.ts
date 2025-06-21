import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiListResponse } from '../../common/utils/paginate'; // Added import

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  getPermissions(): ApiListResponse<string> {
    return this.permissionService.getPermissions();
  }
}
