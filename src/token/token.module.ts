import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PrismaService } from '../core';

@Module({
  controllers: [TokenController],
  providers: [TokenService, PrismaService, JwtService],
})
export class TokenModule {}
