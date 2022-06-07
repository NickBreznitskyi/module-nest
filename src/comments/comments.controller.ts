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
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { Comment } from '@prisma/client';

import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { PaginatedQueryDto, PaginatedResponseDto } from '../dto';
import { ApiPaginatedResponse } from '../decorators';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Create new comment' })
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        authorId: 1,
        postId: 1,
        title: 'Test',
        text: 'Test test test test',
        published: true,
      },
    },
  })
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get comments with filters and pagination' })
  @ApiQuery({
    type: PaginatedQueryDto,
  })
  @ApiPaginatedResponse(CreateCommentDto)
  findAll(@Query() query): Promise<PaginatedResponseDto<Comment>> {
    const { page, limit, ...searchObject } = query;
    return this.commentsService.findAll({
      page,
      limit,
      searchObject,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Get one comment' })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        authorId: 1,
        postId: 1,
        title: 'Test',
        text: 'Test test test test',
        published: true,
      },
    },
  })
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({ summary: 'Update comment by Id' })
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        id: 1,
        authorId: 1,
        postId: 1,
        title: 'Test',
        text: 'Test test test test',
        published: true,
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete comment by Id' })
  @ApiNoContentResponse({
    status: 204,
    description: 'Completed',
  })
  async remove(@Param('id') id: string) {
    await this.commentsService.remove(+id);
  }
}
