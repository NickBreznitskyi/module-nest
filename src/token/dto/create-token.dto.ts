import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({
    required: true,
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly userId: number;

  @ApiProperty({
    example: 'test@test.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Bearer access token',
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoi' +
      'ZGdzeGhnZHNnQG1haWwuY29tIiwicGhvbmUiOiIzODExMTExMDAwMDAiLCJyb2xlIjoi' +
      'QURNSU4iLCJpYXQiOjE2NTQ5NTY3OTgsImV4cCI6MTY1NDk1ODU5OH0.S6IBkgONJtci-w' +
      'X1dXOIcEX0JSMa_TxC6914Woi7TCE',
  })
  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;

  @ApiProperty({
    description: 'Bearer refresh token',
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoi' +
      'ZGdzeGhnZHNnQG1haWwuY29tIiwicGhvbmUiOiIzODExMTExMDAwMDAiLCJyb2xlIjoi' +
      'QURNSU4iLCJpYXQiOjE2NTQ5NTY3OTgsImV4cCI6MTY1NDk1ODU5OH0.S6IBkgONJtci-w' +
      'X1dXOIcEX0JSMa_TxC6914Woi7TCE',
  })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}
