import { Module } from '@nestjs/common';
import { ResearchTypesService } from './research-types.service';
import { ResearchTypesController } from './research-types.controller';

@Module({
  controllers: [ResearchTypesController],
  providers: [ResearchTypesService],
})
export class ResearchTypesModule {}
