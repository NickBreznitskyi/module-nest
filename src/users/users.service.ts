import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../core';
import { PaginatedQueryDto, PaginatedResponseDto } from '../dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async findAll({
    searchObject,
    limit,
    page,
  }: PaginatedQueryDto<User>): Promise<PaginatedResponseDto<User>> {
    const skip = limit * (page - 1);
    const data = await this.prismaService.user.findMany({
      where: {
        AND: [searchObject, { deletedAt: null }],
      },

      skip,
      take: limit,
    });
    const totalCount = await this.prismaService.user.count({
      where: {
        AND: [searchObject, { deletedAt: null }],
      },
    });

    return {
      page,
      limit,
      totalCount,
      data,
    };
  }

  findOne(id: number): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({ where: { id }, data });
  }

  remove(id: number): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
