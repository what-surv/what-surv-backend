import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody } from '@nestjs/swagger';
import { CreateImageDto } from 'src/images/dto/create-image.dto';
import { v4 } from 'uuid';
import { extname } from 'path';

import { ImagesService } from './images.service';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = v4();
          const fileExtName = extname(file.originalname);
          const filename = `${uniqueSuffix}${fileExtName}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @ApiBody({
    type: CreateImageDto,
  })
  async create(@UploadedFile() file: Express.Multer.File) {
    const image = await this.imagesService.create({
      name: file.filename,
      originalName: file.originalname,
      url: file.path,
    });

    return {
      statusCode: 200,
      data: image.url,
    };
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
