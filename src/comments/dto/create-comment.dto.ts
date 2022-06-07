import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Test',
    minLength: 1,
    maxLength: 40,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 40)
  public title: string;

  @ApiProperty({
    example: 'Test',
    minLength: 1,
    maxLength: 40,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  public text: string;

  @ApiProperty({
    example: false,
    required: true,
  })
  @IsBoolean()
  public published: boolean;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  public authorId: number;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  public postId: number;
}
