import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const Genders = {
  male: 'Male',
  female: 'Female',
  all: 'All',
} as const;
export type Gender = (typeof Genders)[keyof typeof Genders];

export const IsValidGender =
  (validationOptions?: ValidationOptions) =>
  (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isValidGender',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return Object.values(Genders).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be one of the following values: ${Object.values(Genders).join(', ')}`;
        },
      },
    });
  };
