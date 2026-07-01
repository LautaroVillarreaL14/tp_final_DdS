import { IsEnum } from 'class-validator';

type UserRole = 'user' | 'admin';

export class UpdateRoleDto {
  @IsEnum(['user', 'admin'] as const)
  role: UserRole;
}
