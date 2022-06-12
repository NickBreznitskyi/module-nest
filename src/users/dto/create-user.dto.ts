import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'Oleg',
    minLength: 2,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @Length(2, 20)
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty({
    example: 'Ivanov',
    minLength: 2,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @Length(2, 20)
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty({
    example: 22,
    required: true,
    minimum: 1,
    maximum: 120,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(1)
  @Max(120)
  public age: number;

  @ApiProperty({
    example: '1234567890',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public phone: string;

  @ApiProperty({
    example: 'test@test.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    example: 'qwerty12345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public password: string;

  public role: Role;
}
