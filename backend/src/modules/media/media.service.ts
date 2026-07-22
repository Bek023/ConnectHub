import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
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

const startsWith =
  (sig: number[], offset = 0) =>
  (buf: Buffer) =>
    buf.length >= offset + sig.length && sig.every((b, i) => buf[offset + i] === b);

const isFtyp = (buf: Buffer) => buf.length >= 8 && buf.slice(4, 8).toString('ascii') === 'ftyp';

const MAGIC_BYTES: Record<string, (buf: Buffer) => boolean> = {
  'image/jpeg': startsWith([0xff, 0xd8, 0xff]),
  'image/png': startsWith([0x89, 0x50, 0x4e, 0x47]),
  'image/gif': startsWith([0x47, 0x49, 0x46, 0x38]),
  'image/webp': (buf) =>
    startsWith([0x52, 0x49, 0x46, 0x46])(buf) &&
    buf.length >= 12 &&
    buf.slice(8, 12).toString('ascii') === 'WEBP',
  'video/mp4': isFtyp,
  'video/quicktime': isFtyp,
  'video/webm': startsWith([0x1a, 0x45, 0xdf, 0xa3]),
  'audio/webm': startsWith([0x1a, 0x45, 0xdf, 0xa3]),
  'audio/ogg': startsWith([0x4f, 0x67, 0x67, 0x53]),
  'audio/mpeg': (buf) =>
    startsWith([0x49, 0x44, 0x33])(buf) ||
    (buf.length >= 2 && buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0),
  'audio/mp4': isFtyp,
  'application/pdf': startsWith([0x25, 0x50, 0x44, 0x46]),
  'application/zip': startsWith([0x50, 0x4b]),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': startsWith([
    0x50, 0x4b,
  ]),
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

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    mediaType: MediaType,
    ownerId: string,
  ) {
    this.validateType(mimeType, mediaType);
    this.validateSize(buffer.length, mediaType);
    this.validateMagicBytes(buffer, mimeType);

    if (mediaType === 'video') {
      return this.enqueueVideo(buffer, originalName, mimeType, ownerId);
    }

    let processedBuffer = buffer;
    let contentType = mimeType;
    let ext = path.extname(originalName);
    let metadata: Record<string, any> = { size: buffer.length, mimeType };

    if (mediaType === 'image' && mimeType !== 'image/gif') {
      const result = await this.processImage(buffer);
      processedBuffer = result.buffer;
      contentType = 'image/webp';
      ext = '.webp';
      metadata = { ...metadata, ...result.metadata };
    }

    const key = `${mediaType}s/${ownerId}/${uuid()}${ext}`;

    await this.putObject(key, processedBuffer, contentType, mediaType !== 'file');

    return { url: `${this.cdnUrl}/${key}`, key, mediaType, metadata };
  }

  async deleteFile(key: string, userId: string) {
    this.assertOwner(key, userId);
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async getPresignedUrl(key: string, userId: string, expiresIn = 3600) {
    this.assertOwner(key, userId);
    return getSignedUrl(this.s3, new GetObjectCommand({ Bucket: this.bucket, Key: key }), {
      expiresIn,
    });
  }

  private assertOwner(key: string, userId: string) {
    const segments = key.split('/');
    if (segments.length < 3 || segments[1] !== userId) {
      throw new ForbiddenException("Bu fayl ustida huquqingiz yo'q");
    }
  }

  private validateMagicBytes(buffer: Buffer, mimeType: string) {
    const check = MAGIC_BYTES[mimeType];
    if (!check) return;
    if (!check(buffer)) {
      throw new BadRequestException("Fayl mazmuni e'lon qilingan turiga mos kelmaydi");
    }
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

  private async enqueueVideo(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    ownerId: string,
  ) {
    const ext = path.extname(originalName);
    const key = `videos/${ownerId}/${uuid()}${ext}`;
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
    let imgMeta: sharp.Metadata;
    let processed: Buffer;
    let thumbnail: Buffer;

    try {
      imgMeta = await sharp(buffer).metadata();

      processed = await sharp(buffer)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      thumbnail = await sharp(buffer)
        .resize(320, 240, { fit: 'cover' })
        .webp({ quality: 70 })
        .toBuffer();
    } catch {
      throw new BadRequestException("Rasm o'qib bo'lmadi yoki buzilgan");
    }

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

  private async putObject(key: string, body: Buffer, contentType: string, publicRead = true) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ...(publicRead ? { ACL: 'public-read' as const } : {}),
        Metadata: {},
      }),
    );
  }
}
