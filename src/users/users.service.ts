import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../core';
import { PaginatedQueryDto, PaginatedResponseDto } from '../dto';
import { S3ManagerService } from '../s3-manager/s3-manager.service';
import { ItemTypeEnum } from '../s3-manager/enums/itemType.enum';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private s3ManagerService: S3ManagerService,
  ) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const userFromDb = await this.findOne({ email: data.email });
    if (userFromDb) {
      throw new BadRequestException({
        message: 'User with this data already exist',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const hashedPass = await UsersService._hashPassword(data.password);
    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPass,
      },
    });

    delete user.password;
    return user;
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

  findOne(searchObj: Partial<User>): Promise<User> {
    return this.prismaService.user.findFirst({ where: searchObj });
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

  async comparePassword(password: string, hash: string): Promise<void> {
    const isPassUnique = await bcrypt.compare(password, hash);

    if (!isPassUnique) {
      throw new ForbiddenException({
        message: 'Wrong email or password',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }
  }

  private static _hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Number(process.env['HASH_SALT']));
  }

  async setAvatar(
    avatar: Express.Multer.File,
    userID: number,
  ): Promise<Partial<User>> {
    const uploadedFile = await this.s3ManagerService.uploadFile(
      avatar,
      ItemTypeEnum.USERS,
      userID,
    );

    return this.prismaService.user.update({
      select: { avatar: true },
      where: { id: userID },
      data: { avatar: uploadedFile.Location },
    });
  }
}
