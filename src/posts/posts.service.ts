import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Post, Prisma } from '@prisma/client';
import { PaginatedQueryDto, PaginatedResponseDto } from '../dto';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prismaService.post.create({ data });
  }

  async findAll({
    searchObject,
    limit,
    page,
  }: PaginatedQueryDto<Post>): Promise<PaginatedResponseDto<Post>> {
    const skip = limit * (page - 1);
    const data = await this.prismaService.post.findMany({
      where: {
        AND: [searchObject, { deletedAt: null }],
      },

      skip,
      take: limit,
    });

    const totalCount = await this.prismaService.post.count({
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

  findOne(id: number): Promise<Post> {
    return this.prismaService.post.findUnique({ where: { id } });
  }

  update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return this.prismaService.post.update({ where: { id }, data });
  }

  remove(id: number): Promise<Post> {
    return this.prismaService.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
