import { Module } from '@nestjs/common';
import { TempController as RoleExampleController } from './role-example.controller';

@Module({
  controllers: [RoleExampleController],
})
export class RoleExampleModule {}
