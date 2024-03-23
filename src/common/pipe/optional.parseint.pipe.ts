import { ArgumentMetadata, Injectable, ParseIntPipe } from '@nestjs/common';
import { isNil } from '../utils';

@Injectable()
export class OptionalParseIntPipe extends ParseIntPipe {
  transform(value: string, metadata: ArgumentMetadata) {
    if (isNil(value)) {
      return value;
    }

    return super.transform(value, metadata);
  }
}
