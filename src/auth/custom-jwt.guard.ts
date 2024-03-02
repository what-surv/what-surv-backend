import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtUserDto } from 'src/auth/dto/jwt-user.dto';
import { IS_PUBLIC_KEY } from 'src/auth/role/public.decorator';
import { isNil } from 'src/common/utils';

@Injectable()
export class CustomJwtGuard implements CanActivate {
  private readonly logger = new Logger(CustomJwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const token =
      this.extractTokenFromHeader(request) ?? request.cookies?.Authentication;

    if (isNil(token)) {
      if (isPublic) {
        return true;
      }

      this.logger.debug('Token is missing!');
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtUserDto = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request.user = payload;
    } catch (e) {
      if (isPublic) {
        return true;
      }

      this.logger.debug('Token is invalid!');
      this.logger.debug(e);

      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
