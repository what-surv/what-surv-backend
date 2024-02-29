import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform {
  transform(value: string, _metadata: ArgumentMetadata) {
    const defaultOrValue = Number((value ?? 1) || 1);

    const isNaN = Number.isNaN(defaultOrValue);
    const isMinus = defaultOrValue < 0;
    if (isNaN || isMinus) {
      throw new BadRequestException('Invalid page query parameter value.');
    }

    return defaultOrValue;
  }
}
