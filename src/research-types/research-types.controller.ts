import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResearchTypesService } from './research-types.service';
import { CreateResearchTypeDto } from './dto/create-research-type.dto';
import { UpdateResearchTypeDto } from './dto/update-research-type.dto';

@Controller('research-types')
export class ResearchTypesController {
  constructor(private readonly researchTypesService: ResearchTypesService) {}

  @Post()
  create(@Body() createResearchTypeDto: CreateResearchTypeDto) {
    return this.researchTypesService.create(createResearchTypeDto);
  }

  @Get()
  findAll() {
    return this.researchTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.researchTypesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRerearchTypeDto: UpdateResearchTypeDto,
  ) {
    return this.researchTypesService.update(+id, updateRerearchTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.researchTypesService.remove(+id);
  }
}