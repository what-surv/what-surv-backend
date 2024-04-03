import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AgesService } from './ages.service';
import { CreateAgeDto } from './dto/create-age.dto';
import { UpdateAgeDto } from './dto/update-age.dto';

@Controller('ages')
export class AgesController {
  constructor(private readonly agesService: AgesService) {}

  @Post()
  create(@Body() createAgeDto: CreateAgeDto) {
    return this.agesService.create(createAgeDto);
  }

  @Get()
  findAll() {
    return this.agesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgeDto: UpdateAgeDto) {
    return this.agesService.update(+id, updateAgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agesService.remove(+id);
  }
}
