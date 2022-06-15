import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Post, Prisma } from '@prisma/client';
import { PaginatedQueryDto, PaginatedResponseDto } from '../dto';
import { S3ManagerService } from '../s3-manager/s3-manager.service';
import { ItemTypeEnum } from '../s3-manager/enums/itemType.enum';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private s3ManagerService: S3ManagerService,
  ) {}

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

  async update(
    id: number,
    data: Prisma.PostUpdateInput,
    photo?: Express.Multer.File,
  ): Promise<Post> {
    if (photo) {
      const uploadedFile = await this.s3ManagerService.uploadFile(
        photo,
        ItemTypeEnum.POSTS,
        id,
      );

      return this.prismaService.post.update({
        where: { id },
        data: {
          ...data,
          photo: uploadedFile.Location,
        },
      });
    }
    return this.prismaService.post.update({ where: { id }, data });
  }

  remove(id: number): Promise<Post> {
    return this.prismaService.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
