import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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
}
