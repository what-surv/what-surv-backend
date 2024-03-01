import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/role/public.decorator';
import { Roles } from 'src/auth/role/role';
import { RequireRoles } from 'src/auth/role/role.decorator';

@ApiTags('(For Tests) Role Example')
@Controller('role-example')
export class TempController {
  @ApiOperation({ summary: 'Public access endpoint' })
  @Public()
  @Get('public-access')
  async publicAccess() {
    return 'you do not need to be logged in';
  }

  @ApiOperation({ summary: 'Login required endpoint' })
  @Get('login-required')
  async loginRequired() {
    return 'you are logged in';
  }

  @ApiOperation({ summary: 'User role requird endpoint' })
  @RequireRoles(Roles.User)
  @Get('user')
  async userRoleRequired() {
    return 'you have User role';
  }

  @ApiOperation({ summary: 'Admin role required endpoint' })
  @RequireRoles(Roles.Admin)
  @Get('admin')
  async adminRoleRequired() {
    return 'you have Admin role';
  }
}
