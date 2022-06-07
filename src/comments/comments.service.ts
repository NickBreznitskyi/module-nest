import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';

import { PrismaService } from '../core';
import { PaginatedQueryDto, PaginatedResponseDto } from '../dto';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prismaService.comment.create({ data });
  }

  async findAll({
    searchObject,
    limit,
    page,
  }: PaginatedQueryDto<Comment>): Promise<PaginatedResponseDto<Comment>> {
    const skip = limit * (page - 1);
    const data = await this.prismaService.comment.findMany({
      where: {
        AND: [searchObject, { deletedAt: null }],
      },

      skip,
      take: limit,
    });

    const totalCount = await this.prismaService.comment.count({
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

  findOne(id: number): Promise<Comment> {
    return this.prismaService.comment.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.CommentUpdateInput): Promise<Comment> {
    return this.prismaService.comment.update({ where: { id }, data });
  }

  remove(id: number): Promise<Comment> {
    return this.prismaService.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
