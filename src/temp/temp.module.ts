import { Module } from '@nestjs/common';
import { TempController } from './temp.controller';

@Module({
  controllers: [TempController]
})
export class TempModule {}
