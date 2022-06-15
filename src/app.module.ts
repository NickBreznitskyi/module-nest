import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { S3ManagerModule } from './s3-manager/s3-manager.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: process.env['S3_REGION'],
        accessKeyId: process.env['S3_ACCESS_KEY'],
        secretAccessKey: process.env['S3_SECRET_KEY'],
      },
      services: [S3],
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    TokenModule,
    S3ManagerModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
