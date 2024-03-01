import { Role } from 'src/auth/role/role';

export interface JwtUserDto {
  id: number;
  nickname: string;
  role: Role;
  provider: string;
  providerId: string;
  email: string;
}
