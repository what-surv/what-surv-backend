import { Injectable } from '@nestjs/common';
import { Image } from 'src/images/entities/image.entity';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  async create({
    name,
    originalName,
    url,
  }: {
    name: string;
    originalName: string;
    url: string;
  }) {
    const image = Image.create({
      name,
      originalName,
      url,
    });

    return image.save();
  }

  findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
