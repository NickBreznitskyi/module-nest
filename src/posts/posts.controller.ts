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
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Post as PostType } from '@prisma/client';
import { PaginatedQueryDto, PaginatedResponseDto } from '../dto';
import { ApiPaginatedResponse } from '../decorators';

@ApiTags('Posts')
@Controller('posts')
@ApiExtraModels(PaginatedResponseDto)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Create new post' })
  @ApiBody({
    type: CreatePostDto,
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        authorId: 1,
        title: 'Test',
        text: 'Test test test test',
        published: true,
      },
    },
  })
  create(@Body() createPostDto: CreatePostDto): Promise<PostType> {
    return this.postsService.create(createPostDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get posts with filters and pagination' })
  @ApiQuery({
    type: PaginatedQueryDto,
  })
  @ApiPaginatedResponse(CreatePostDto)
  findAll(@Query() query): Promise<PaginatedResponseDto<PostType>> {
    const { page, limit, ...searchObject } = query;
    return this.postsService.findAll({
      page,
      limit,
      searchObject,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Get one post' })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        authorId: 1,
        title: 'Test',
        text: 'Test test test test',
        published: true,
      },
    },
  })
  findOne(@Param('id') id: string): Promise<PostType> {
    return this.postsService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({ summary: 'Update post by Id' })
  @ApiBody({
    type: UpdatePostDto,
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        authorId: 1,
        title: 'Test',
        text: 'Test test test test',
        published: true,
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostType> {
    return this.postsService.update(+id, updatePostDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete post by Id' })
  @ApiNoContentResponse({
    status: 204,
    description: 'Completed',
  })
  async remove(@Param('id') id: string) {
    await this.postsService.remove(+id);
  }
}
