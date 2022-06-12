import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Token } from '@prisma/client';

import { CreateTokenDto } from './dto/create-token.dto';
import { PrismaService } from '../core';
import { IPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  create(data: Prisma.TokenCreateInput): Promise<Token> {
    return this.prismaService.token.create({ data });
  }

  findOne(token: string, userId: number): Promise<Token> {
    return this.prismaService.token.findFirst({
      where: {
        userId,
        OR: [{ accessToken: token }, { refreshToken: token }],
        deletedAt: null,
      },
    });
  }

  delete(tokenDto: Partial<CreateTokenDto>): Promise<Token> {
    return this.prismaService.token.update({
      where: tokenDto,
      data: { deletedAt: new Date() },
    });
  }

  deleteMany(id: number) {
    return this.prismaService.token.updateMany({
      where: { userId: id },
      data: { deletedAt: new Date() },
    });
  }

  generateTokenPair(payload: IPayload): CreateTokenDto {
    return {
      userId: payload.userId,
      email: payload.email,
      accessToken: this.jwtService.sign(payload, {
        secret: process.env['SECRET_KEY'],
        expiresIn: process.env['EXPIRES_IN_ACCESS'],
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env['SECRET_KEY'],
        expiresIn: process.env['EXPIRES_IN_REFRESH'],
      }),
    };
  }

  //todo remove method
  verifyToken(token: string) {
    try {
      const data = this.jwtService.verify(token);
      const tokenFromDb = this.findOne(token, data.userId);
      if (!tokenFromDb) {
        return new UnauthorizedException({
          message: 'Token expired',
        });
      }
      return data;
    } catch (e) {
      return new UnauthorizedException();
    }
  }
}
