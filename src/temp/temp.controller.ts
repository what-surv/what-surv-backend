import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/utils';

@ApiTags('Temp')
@Controller('temp')
export class TempController {
  @ApiOperation({ summary: 'a' })
  @Get('a')
  async a() {
    return 'a';
  }

  @ApiOperation({ summary: 'b' })
  @Public()
  @Get('b')
  async b() {
    return 'b';
  }
}
