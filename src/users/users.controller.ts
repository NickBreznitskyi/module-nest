import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import {
  ApiBody,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginatedQueryDto, PaginatedResponseDto } from '../dto';
import { ApiPaginatedResponse } from '../decorators';

@ApiTags('Users')
@Controller('users')
@ApiExtraModels(PaginatedResponseDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiOkResponse({
    status: 200,
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
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get users with filters and pagination' })
  @ApiQuery({
    type: PaginatedQueryDto,
  })
  @ApiPaginatedResponse(CreateUserDto)
  findAll(
    @Query() query /*: PaginationDto<User> */,
    //Коли присвоюю тип то воно не хоче працювати, навіть не бере дефолтны значення з ДТО
  ): Promise<PaginatedResponseDto<User>> {
    const { page, limit, ...searchObject } = query;
    return this.usersService.findAll({
      page,
      limit,
      searchObject,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Get one user' })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        email: 'example@mail.com',
        firstname: 'Oleg',
        lastName: 'Ivanov',
        age: 30,
        role: 'user',
        password: 'qwerty12345',
      },
    },
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne({ id: Number(id) });
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by Id' })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        email: 'example@mail.com',
        firstname: 'Oleg',
        lastName: 'Ivanov',
        age: 30,
        password: 'qwerty12345',
        role: 'user',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete user by Id' })
  @ApiNoContentResponse({
    status: 204,
    description: 'Completed',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(+id);
  }
}
