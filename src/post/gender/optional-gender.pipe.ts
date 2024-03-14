import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isNil } from 'src/common/utils';
import { isGender } from 'src/post/gender/gender';

@Injectable()
export class OptionalGenderPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (isNil(value)) {
      return value;
    }

    if (!isGender(value)) {
      throw new BadRequestException(`"${value}" is an invalid gender`);
    }

    return value;
  }
}
