import { SetMetadata } from '@nestjs/common';

export const isNil = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
