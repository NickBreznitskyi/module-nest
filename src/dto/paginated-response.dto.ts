import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<TData> {
  @ApiProperty({
    default: 1,
    example: 1,
    minimum: 1,
    description: 'Number of current page',
    required: false,
  })
  public page: number;

  @ApiProperty({
    default: 10,
    example: 10,
    minimum: 1,
    description: 'Count items in response',
    required: false,
  })
  public limit: number;

  @ApiProperty({
    default: 0,
    example: 1,
    minimum: 0,
    description: 'Total count',
    required: false,
  })
  public totalCount: number;

  public data: TData[];
}
