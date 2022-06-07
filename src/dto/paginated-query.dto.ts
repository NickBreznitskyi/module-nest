import { ApiProperty } from '@nestjs/swagger';

export class PaginatedQueryDto<TData> {
  @ApiProperty({
    example: {
      someKey: 'someValue',
    },
    required: false,
  })
  readonly searchObject?: Partial<TData>;

  @ApiProperty({
    default: 10,
    example: 10,
    minimum: 1,
    description: 'Count items in response',
    required: false,
  })
  readonly limit? = 10;

  @ApiProperty({
    default: 1,
    example: 1,
    minimum: 1,
    description: 'Number of current page',
    required: false,
  })
  readonly page? = 1;
}
