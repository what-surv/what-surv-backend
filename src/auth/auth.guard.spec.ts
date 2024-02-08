import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '@nestjs/jwt';
import { CustomJwtAuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let jwtService: JwtService;
  let reflector: Reflector;
  let configService: ConfigService;
  let customJwtAuthGuard: CustomJwtAuthGuard;
  let executionContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    executionContext = new ExecutionContextHost([], undefined, undefined);

    customJwtAuthGuard = new CustomJwtAuthGuard(
      jwtService,
      reflector,
      configService,
    );
  });

  it('should be defined', () => {
    expect(CustomJwtAuthGuard).toBeDefined();
  });

  it('basic test', async () => {
    const result = true;
    jest
      .spyOn(executionContext, 'getHandler')
      .mockImplementation(null as unknown as any);
    jest
      .spyOn(executionContext, 'getClass')
      .mockImplementation(null as unknown as any);
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation(() => result);

    expect(await customJwtAuthGuard.canActivate(executionContext)).toBe(true);
  });
});
