import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';

type MediaType = 'image' | 'video' | 'voice' | 'file';

const ALLOWED_TYPES: Record<MediaType, string[]> = {
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

const MAX_SIZES: Record<MediaType, number> = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  voice: 20 * 1024 * 1024,
  file: 50 * 1024 * 1024,
};

@Injectable()
export class MediaService {
  private s3: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: config.get<string>('AWS_REGION', 'us-east-1'),
      endpoint: config.get<string>('S3_ENDPOINT'),
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
    this.bucket = config.get<string>('S3_BUCKET', '');
    this.cdnUrl = config.get<string>('CDN_URL', '');
  }

  async uploadFile(buffer: Buffer, originalName: string, mimeType: string, mediaType: MediaType) {
    if (!ALLOWED_TYPES[mediaType].includes(mimeType)) {
      throw new BadRequestException(`${mimeType} turi ruxsat etilmagan`);
    }
    if (buffer.length > MAX_SIZES[mediaType]) {
      throw new BadRequestException('Fayl hajmi juda katta');
    }

    let processedBuffer = buffer;
    let metadata: Record<string, any> = { size: buffer.length, mimeType };

    if (mediaType === 'image') {
      const result = await this.processImage(buffer);
      processedBuffer = result.buffer;
      metadata = { ...metadata, ...result.metadata };
    }

    if (mediaType === 'video') {
      const result = await this.processVideo(buffer, originalName);
      metadata = { ...metadata, ...result };
    }

    const ext = path.extname(originalName);
    const key = `${mediaType}s/${uuid()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: processedBuffer,
        ContentType: mimeType,
        ACL: 'public-read',
        Metadata: { originalName: encodeURIComponent(originalName) },
      }),
    );

    return { url: `${this.cdnUrl}/${key}`, key, mediaType, metadata };
  }

  private async processImage(buffer: Buffer) {
    const image = sharp(buffer);
    const imgMeta = await image.metadata();

    const processed = await image
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const thumbnail = await sharp(buffer).resize(320, 240, { fit: 'cover' }).webp({ quality: 70 }).toBuffer();

    const thumbKey = `thumbnails/${uuid()}.webp`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: thumbKey,
        Body: thumbnail,
        ContentType: 'image/webp',
        ACL: 'public-read',
      }),
    );

    return {
      buffer: processed,
      metadata: {
        width: imgMeta.width,
        height: imgMeta.height,
        thumbnailUrl: `${this.cdnUrl}/${thumbKey}`,
      },
    };
  }

  private async processVideo(buffer: Buffer, name: string) {
    const tmpInput = `/tmp/${uuid()}${path.extname(name)}`;
    const tmpThumb = `/tmp/${uuid()}.jpg`;
    await fs.writeFile(tmpInput, buffer);

    return new Promise<object>((resolve, reject) => {
      ffmpeg(tmpInput)
        .screenshots({ count: 1, filename: path.basename(tmpThumb), folder: '/tmp' })
        .on('end', async () => {
          const thumbBuffer = await fs.readFile(tmpThumb);
          const thumbKey = `thumbnails/${uuid()}.jpg`;
          await this.s3.send(
            new PutObjectCommand({
              Bucket: this.bucket,
              Key: thumbKey,
              Body: thumbBuffer,
              ContentType: 'image/jpeg',
              ACL: 'public-read',
            }),
          );
          await fs.unlink(tmpInput).catch(() => {});
          await fs.unlink(tmpThumb).catch(() => {});
          resolve({ thumbnailUrl: `${this.cdnUrl}/${thumbKey}` });
        })
        .on('error', reject);
    });
  }

  async deleteFile(key: string) {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async getPresignedUrl(key: string, expiresIn = 3600) {
    return getSignedUrl(this.s3, new GetObjectCommand({ Bucket: this.bucket, Key: key }), { expiresIn });
  }
}
