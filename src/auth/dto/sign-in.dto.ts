import { ApiBodyOptions, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'user' })
  @IsNotEmpty({ message: 'username is required' })
  @IsString({ message: 'username must be a string' })
  username?: string;

  @ApiProperty({ example: 'userpw' })
  @IsNotEmpty({ message: 'password is required' })
  @IsString({ message: 'password must be a string' })
  @MinLength(4, { message: 'password must be at least 6 characters' })
  password?: string;
}

export const signInDtoBodyOptions: ApiBodyOptions = {
  type: SignInDto,
  description: 'username, password',
  required: true,
  examples: {
    userExample: {
      value: {
        username: 'user',
        password: 'userpw',
      },
    },
    adminExample: {
      value: {
        username: 'admin',
        password: 'adminpw',
      },
    },
    emptyUsernameAndPassword: {
      value: {
        username: '', // Violates @IsNotEmpty for username
        password: '', // Violates @IsNotEmpty and @MinLength for password
      },
      description: 'Both username and password are empty strings.',
    },
    nullUsernameAndPassword: {
      value: {
        username: null, // Violates @IsNotEmpty and potentially @IsString (depending on how validation is handled for null)
        password: null, // Violates @IsNotEmpty, @IsString, and @MinLength
      },
      description: 'Both username and password are null.',
    },
    shortPassword: {
      value: {
        username: 'user', // Valid username
        password: 'abc', // Violates @MinLength for password
      },
      description:
        'Password is shorter than the minimum required length of 4 characters.',
    },
    nonStringValues: {
      value: {
        username: 123, // Violates @IsString for username
        password: true, // Violates @IsString and @MinLength for password
      },
      description: 'Username and password are not strings.',
    },
    missingUsernameField: {
      value: {
        // No username field, violating @IsNotEmpty for username
        password: 'validPW', // Valid password
      },
      description: 'Username field is missing.',
    },
    missingPasswordField: {
      value: {
        username: 'validUser', // Valid username
        // No password field, violating @IsNotEmpty and @MinLength for password
      },
      description: 'Password field is missing.',
    },
    whitelistViolation: {
      value: {
        username: 'admin',
        password: 'adminpw',
        white: 'violate',
      },
    },
  },
};
