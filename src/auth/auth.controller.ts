import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';
import { CreateTokenDto } from '../token/dto/create-token.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        userId: 2,
        email: 'zxфцуcv@mail.com',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWls' +
          'IjoienjRhNGG0YNjdkBtYWlsLmNvbSIsInBob25lIjoiNDI3NDI2OTg5MCIsI' +
          'nJvbGUiOiJBRE1JTiIsImlhdCI6MTY1NTAyNzY0NCwiZXhwIjoxNjU1MDI5ND' +
          'Q0fQ.7NDSgfE7aC9yfqnB5A5W_8arygY8zwJKvuoQXrTiwAQ',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsI' +
          'joienjRhNGG0YNjdkBtYWlsLmNvbSIsInBob25lIjoiNDI3NDI2OTg5MCIsInJ' +
          'vbGUiOiJBRE1JTiIsImlhdCI6MTY1NTAyNzY0NCwiZXhwIjoxNjU3NjE5NjQ0f' +
          'Q.DaW9Eob_bPhNbv25EfXMQ_LCjAIFvGyP2-jidJkbvnc',
      },
    },
  })
  @ApiForbiddenResponse({
    status: 403,
    schema: {
      example: {
        message: 'Wrong email or password',
        statusCode: HttpStatus.FORBIDDEN,
      },
    },
  })
  login(@Body() loginDto: LoginDto): Promise<CreateTokenDto> {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/registration')
  @ApiOperation({ summary: 'Registration user' })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    status: 201,
    schema: {
      example: {
        id: 1,
        email: 'example@mail.com',
        firstName: 'Oleg',
        lastName: 'Ivanov',
        phone: '1234567890',
        age: 30,
      },
    },
  })
  @ApiBadRequestResponse({
    status: 404,
    schema: {
      example: {
        message: 'User with this data already exist',
        statusCode: HttpStatus.BAD_REQUEST,
      },
    },
  })
  registration(@Body() userDto: CreateUserDto): Promise<User> {
    return this.authService.registration(userDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiNoContentResponse({
    status: 204,
  })
  @ApiUnauthorizedResponse({
    status: 401,
  })
  @UseGuards(AuthGuard('jwt'))
  logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/admin')
  @ApiOperation({ summary: 'Give user role ADMIN' })
  @ApiBearerAuth('access')
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 2,
        email: 'zxфцуcv@mail.com',
        firstName: 'test2',
        lastName: 'test2',
        age: 22,
        phone: '4274269890',
        role: 'ADMIN',
        createdAt: '2022-06-11T15:25:01.514Z',
        deletedAt: null,
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    status: 403,
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden',
      },
    },
  })
  @ApiQuery({
    example: {
      secretAdminKey: 'test',
    },
  })
  @UseGuards(AuthGuard('jwt'))
  giveAdmin(@Request() req, @Query() { secretAdminKey }): Promise<User> {
    return this.authService.giveAdmin(secretAdminKey, req.user.email);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  @Post('/refresh')
  @ApiBearerAuth('refresh')
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        userId: 2,
        email: 'zxфцуcv@mail.com',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWls' +
          'IjoienjRhNGG0YNjdkBtYWlsLmNvbSIsInBob25lIjoiNDI3NDI2OTg5MCIsI' +
          'nJvbGUiOiJBRE1JTiIsImlhdCI6MTY1NTAyNzY0NCwiZXhwIjoxNjU1MDI5ND' +
          'Q0fQ.7NDSgfE7aC9yfqnB5A5W_8arygY8zwJKvuoQXrTiwAQ',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsI' +
          'joienjRhNGG0YNjdkBtYWlsLmNvbSIsInBob25lIjoiNDI3NDI2OTg5MCIsInJ' +
          'vbGUiOiJBRE1JTiIsImlhdCI6MTY1NTAyNzY0NCwiZXhwIjoxNjU3NjE5NjQ0f' +
          'Q.DaW9Eob_bPhNbv25EfXMQ_LCjAIFvGyP2-jidJkbvnc',
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
  })
  @UseGuards(AuthGuard('jwt'))
  refresh(@Request() req): Promise<CreateTokenDto> {
    return this.authService.refresh(req.user);
  }
}
