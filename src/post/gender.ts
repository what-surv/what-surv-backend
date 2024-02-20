import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const genderEnum = {
  male: 'Male',
  female: 'Female',
  all: 'All',
} as const;
export type Gender = (typeof genderEnum)[keyof typeof genderEnum];

export const IsValidGender = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isValidGender',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return Object.values(genderEnum).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be one of the following values: ${Object.values(genderEnum).join(', ')}`;
        },
      },
    });
  };
};
