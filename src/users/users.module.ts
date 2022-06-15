import { Module } from '@nestjs/common';

import { PrismaService } from '../core';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { S3ManagerService } from '../s3-manager/s3-manager.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, S3ManagerService],

  exports: [UsersService],
})
export class UsersModule {}
