import { Injectable } from '@nestjs/common';
import { CreateResearchTypeDto } from './dto/create-research-type.dto';
import { UpdateResearchTypeDto } from './dto/update-research-type.dto';

@Injectable()
export class ResearchTypesService {
  create(createResearchTypeDto: CreateResearchTypeDto) {
    return 'This action adds a new researchType';
  }

  findAll() {
    return `This action returns all researchTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} researchType`;
  }

  update(id: number, updateResearchTypeDto: UpdateResearchTypeDto) {
    return `This action updates a #${id} researchType`;
  }

  remove(id: number) {
    return `This action removes a #${id} researchType`;
  }
}
