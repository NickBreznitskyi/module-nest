import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '../core';
import { S3ManagerService } from '../s3-manager/s3-manager.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, S3ManagerService],
})
export class PostsModule {}
