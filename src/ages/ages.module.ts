import { Module } from '@nestjs/common';
import { AgesService } from './ages.service';
import { AgesController } from './ages.controller';

@Module({
  controllers: [AgesController],
  providers: [AgesService],
})
export class AgesModule {}
