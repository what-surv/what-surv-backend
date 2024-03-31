import { PartialType } from '@nestjs/swagger';
import { CreateAgeDto } from './create-age.dto';

export class UpdateAgeDto extends PartialType(CreateAgeDto) {}
