import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from './token.service';
import { PrismaService } from '../core';

@Module({
  controllers: [],
  providers: [TokenService, PrismaService, JwtService],
})
export class TokenModule {}
