import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

export const VIDEO_QUEUE = 'video-processing';

export interface VideoJob {
  tmpPath: string;
  key: string;
  jobId: string;
}

@Processor(VIDEO_QUEUE)
export class VideoProcessor extends WorkerHost {
  private s3: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor(private config: ConfigService) {
    super();
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

  async process(job: Job<VideoJob>): Promise<{ thumbnailUrl: string }> {
    const { tmpPath } = job.data;
    const tmpThumb = `/tmp/${uuid()}.jpg`;

    try {
      await new Promise<void>((resolve, reject) => {
        ffmpeg(tmpPath)
          .screenshots({
            count: 1,
            filename: path.basename(tmpThumb),
            folder: '/tmp',
            timemarks: ['00:00:01'],
          })
          .on('end', () => resolve())
          .on('error', reject);
      });

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

      return { thumbnailUrl: `${this.cdnUrl}/${thumbKey}` };
    } finally {
      await fs.unlink(tmpPath).catch(() => {});
      await fs.unlink(tmpThumb).catch(() => {});
    }
  }
}
