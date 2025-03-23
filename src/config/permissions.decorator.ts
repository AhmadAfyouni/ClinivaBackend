import { SetMetadata } from '@nestjs/common';
import { PermissionsEnum } from './permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: PermissionsEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
