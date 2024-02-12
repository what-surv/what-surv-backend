import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/role/role.decorator';
import { Public } from 'src/common/utils';

@ApiTags('Role Example')
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
  @Roles('user')
  @Get('user')
  async userRoleRequired() {
    return 'you have User role';
  }

  @ApiOperation({ summary: 'Admin role required endpoint' })
  @Roles('admin')
  @Get('admin')
  async adminRoleRequired() {
    return 'you have Admin role';
  }
}
