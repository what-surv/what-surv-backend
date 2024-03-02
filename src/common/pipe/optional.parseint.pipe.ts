/* 컨트롤러 쿼리 등등 인자 값 default를 위해 공통 pipe로 이동합니다. */

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform {
  private defaultValue: number | undefined;

  static defaultValue(defaultValue: number): OptionalParseIntPipe {
    const optionalParseIntPipe = new OptionalParseIntPipe();
    optionalParseIntPipe.defaultValue = defaultValue;
    return optionalParseIntPipe;
  }

  transform(value: string, _metadata: ArgumentMetadata) {
    const defaultOrValue = this.defaultValue ?? Number((value ?? 1) || 1);

    const isNaN = Number.isNaN(defaultOrValue);
    const isMinus = defaultOrValue < 0;
    if (isNaN || isMinus) {
      throw new BadRequestException('Invalid page query parameter value.');
    }

    return defaultOrValue;
  }
}
