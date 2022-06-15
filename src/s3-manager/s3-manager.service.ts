import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

import { ItemTypeEnum } from './enums/itemType.enum';
import { fileType } from '../constants/fileType';
import { ManagedUpload } from 'aws-sdk/clients/s3';

@Injectable()
export class S3ManagerService {
  constructor(@InjectAwsService(S3) private readonly s3: S3) {}

  async listBucketContents(bucket: string): Promise<string[]> {
    const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    return response.Contents.map((c) => c.Key);
  }

  async uploadFile(
    file: Express.Multer.File,
    itemType: ItemTypeEnum,
    itemId: number,
  ): Promise<ManagedUpload.SendData> {
    this._fileFilter(file);
    const uploadFilePath = this._fileNameBuilder(
      file.originalname,
      itemType,
      itemId.toString(),
    );

    const uploadedFile = await this.s3
      .upload({
        Bucket: process.env['S3_NAME'],
        Body: file.buffer,
        Key: uploadFilePath,
        ContentType: file.mimetype,
      })
      .promise();

    if (!uploadedFile) {
      throw new BadRequestException();
    }

    return uploadedFile;
  }

  private _fileNameBuilder(
    fileName: string,
    itemType: ItemTypeEnum,
    itemId: string,
  ): string {
    const fileExtension = path.extname(fileName);
    return path.join(itemType, itemId, uuidv4(), fileExtension);
  }

  private _fileFilter(file: Express.Multer.File): void {
    if (!fileType.IMAGES.includes(file.mimetype)) {
      throw new BadRequestException({
        message: `File ${file.originalname} unsupported media type`,
        statusCode: 404,
      });
    }
  }
}
