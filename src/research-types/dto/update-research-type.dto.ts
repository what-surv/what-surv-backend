import { PartialType } from '@nestjs/swagger';
import { CreateResearchTypeDto } from './create-research-type.dto';

export class UpdateResearchTypeDto extends PartialType(CreateResearchTypeDto) {}
