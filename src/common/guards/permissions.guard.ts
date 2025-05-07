import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsEnum } from '../../config/permission.enum';
import { PERMISSIONS_KEY } from '../../config/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    console.log('@1@PermissionsGuard');
    // Get the required permissions from the custom decorator (if any)
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionsEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    console.log('@2@requiredPermissions', requiredPermissions);
    // If no specific permissions are required, allow access (no auto-inference)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      console.log('@3@PermissionsGuard');

      return true;
    }

    // Extract user from request (assuming an authentication guard has set request.user)
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      console.log('@4@PermissionsGuard');
      // No user found (not logged in), deny access
      return false;
    }

    // Check if user has at least one of the required permissions
    const userPermissions: PermissionsEnum[] = user.permissions || [];

    // Allow everything if user has ADMIN permissions
    if (userPermissions.includes(PermissionsEnum.ADMIN)) {
      console.log('@5@PermissionsGuard');
      return true;
    }

    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  }
}
