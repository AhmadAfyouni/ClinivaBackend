import { Injectable } from '@nestjs/common';
import { PermissionsEnum } from '../../config/permission.enum';
import { ApiListResponse } from '../../common/utils/paginate';

@Injectable()
export class PermissionService {
  getPermissions(): ApiListResponse<string> {
    const permissions = Object.values(PermissionsEnum);
    const totalItems = permissions.length;
    return {
      message: 'Permissions fetched successfully',
      success: true,
      data: permissions,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: totalItems,
        items_per_page: totalItems,
        current_page_items_count: totalItems,
        has_next_page: false,
        has_previous_page: false,
      },
    };
  }
}
