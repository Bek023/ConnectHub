import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';
import { VIDEO_QUEUE } from './video.processor';

export type MediaType = 'image' | 'video' | 'voice' | 'file';

export const ALLOWED_MIME_TYPES: Record<MediaType, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  voice: ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4'],
  file: [
    'application/pdf',
    'application/zip',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

export const MAX_SIZES: Record<MediaType, number> = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  voice: 20 * 1024 * 1024,
  file: 50 * 1024 * 1024,
};

const MAX_SIZE_LABELS: Record<MediaType, string> = {
  image: '10MB',
  video: '100MB',
  voice: '20MB',
  file: '50MB',
};

@Injectable()
export class MediaService {
  private s3: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor(
    private config: ConfigService,
    @InjectQueue(VIDEO_QUEUE) private videoQueue: Queue,
  ) {
    this.s3 = new S3Client({
      region: config.get<string>('AWS_REGION', 'us-east-1'),
      endpoint: config.get<string>('S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
    this.bucket = config.get<string>('S3_BUCKET', '');
    this.cdnUrl = config.get<string>('CDN_URL', '');
  }

  async uploadFile(buffer: Buffer, originalName: string, mimeType: string, mediaType: MediaType) {
    this.validateType(mimeType, mediaType);
    this.validateSize(buffer.length, mediaType);

    if (mediaType === 'video') {
      return this.enqueueVideo(buffer, originalName, mimeType);
    }

    let processedBuffer = buffer;
    let metadata: Record<string, any> = { size: buffer.length, mimeType };

    if (mediaType === 'image') {
      const result = await this.processImage(buffer);
      processedBuffer = result.buffer;
      metadata = { ...metadata, ...result.metadata };
    }

    const ext = path.extname(originalName);
    const key = `${mediaType}s/${uuid()}${ext}`;

    await this.putObject(key, processedBuffer, mimeType);

    return { url: `${this.cdnUrl}/${key}`, key, mediaType, metadata };
  }

  async deleteFile(key: string) {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async getPresignedUrl(key: string, expiresIn = 3600) {
    return getSignedUrl(this.s3, new GetObjectCommand({ Bucket: this.bucket, Key: key }), {
      expiresIn,
    });
  }

  private validateType(mimeType: string, mediaType: MediaType) {
    if (!ALLOWED_MIME_TYPES[mediaType].includes(mimeType)) {
      throw new BadRequestException(
        `"${mimeType}" turi ruxsat etilmagan. Ruxsat etilgan turlar: ${ALLOWED_MIME_TYPES[mediaType].join(', ')}`,
      );
    }
  }

  private validateSize(size: number, mediaType: MediaType) {
    if (size > MAX_SIZES[mediaType]) {
      throw new BadRequestException(`Fayl hajmi ${MAX_SIZE_LABELS[mediaType]}dan oshmasligi kerak`);
    }
    if (size === 0) {
      throw new BadRequestException("Fayl bo'sh bo'lishi mumkin emas");
    }
  }

  private async enqueueVideo(buffer: Buffer, originalName: string, mimeType: string) {
    const ext = path.extname(originalName);
    const key = `videos/${uuid()}${ext}`;
    const tmpPath = `/tmp/${uuid()}${ext}`;

    await fs.writeFile(tmpPath, buffer);
    await this.putObject(key, buffer, mimeType);

    const job = await this.videoQueue.add('generate-thumbnail', { tmpPath, key });

    return {
      url: `${this.cdnUrl}/${key}`,
      key,
      mediaType: 'video',
      metadata: { size: buffer.length, mimeType },
      processingJobId: job.id,
    };
  }

  private async processImage(buffer: Buffer) {
    const imgMeta = await sharp(buffer).metadata();

    const processed = await sharp(buffer)
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const thumbnail = await sharp(buffer)
      .resize(320, 240, { fit: 'cover' })
      .webp({ quality: 70 })
      .toBuffer();

    const thumbKey = `thumbnails/${uuid()}.webp`;
    await this.putObject(thumbKey, thumbnail, 'image/webp');

    return {
      buffer: processed,
      metadata: {
        width: imgMeta.width,
        height: imgMeta.height,
        thumbnailUrl: `${this.cdnUrl}/${thumbKey}`,
      },
    };
  }

  private async putObject(key: string, body: Buffer, contentType: string) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read',
        Metadata: {},
      }),
    );
  }
}
