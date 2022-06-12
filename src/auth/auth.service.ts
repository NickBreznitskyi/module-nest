import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';
import { IPayload } from '../token/interfaces';
import { TokenService } from '../token/token.service';
import { CreateTokenDto } from '../token/dto/create-token.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../core';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private prismaService: PrismaService,
  ) {}

  async validateUser({ email, password }: LoginDto): Promise<User> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException({
        message: 'Wrong email or password',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
    await this.usersService.comparePassword(password, user.password);

    return user;
  }

  async login(loginDto: LoginDto): Promise<CreateTokenDto> {
    const { id, phone, role, email } = await this.validateUser(loginDto);
    const payload = {
      userId: id,
      email,
      phone,
      role,
    } as IPayload;

    return this.tokenService.generateTokenPair(payload);
  }

  registration(userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  async giveAdmin(secretAdminKey: string, email: string): Promise<User> {
    if (secretAdminKey !== process.env['SECRET_ADMIN_KEY']) {
      throw new ForbiddenException();
    }
    const user = await this.prismaService.user.update({
      where: {
        email,
      },
      data: {
        role: Role.ADMIN,
      },
    });

    delete user.password;
    return user;
  }

  logout({ userId }: IPayload) {
    return this.tokenService.deleteMany(userId);
  }

  async refresh(payload: IPayload): Promise<CreateTokenDto> {
    await this.tokenService.deleteMany(payload.userId);
    const tokenPair = this.tokenService.generateTokenPair(payload);
    await this.tokenService.create(tokenPair);
    return tokenPair;
  }
}
