import { Injectable } from '@nestjs/common';
import { CreateAgeDto } from './dto/create-age.dto';
import { UpdateAgeDto } from './dto/update-age.dto';

@Injectable()
export class AgesService {
  create(createAgeDto: CreateAgeDto) {
    return 'This action adds a new age';
  }

  findAll() {
    return `This action returns all ages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} age`;
  }

  update(id: number, updateAgeDto: UpdateAgeDto) {
    return `This action updates a #${id} age`;
  }

  remove(id: number) {
    return `This action removes a #${id} age`;
  }
}
