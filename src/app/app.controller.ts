import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from 'src/auth/role/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  @Redirect('/api')
  redirectToApi() {}
}
