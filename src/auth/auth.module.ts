import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../core';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, PrismaService],
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
