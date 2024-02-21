import { SetMetadata } from '@nestjs/common';
import { Role } from './role';

export const ROLES_KEY = 'roles';
export const RequireRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
