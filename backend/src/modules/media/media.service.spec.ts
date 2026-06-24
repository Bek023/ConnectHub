import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getQueueToken } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { MediaService, ALLOWED_MIME_TYPES, MAX_SIZES } from './media.service';
import { VIDEO_QUEUE } from './video.processor';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: jest.fn().mockResolvedValue({}) })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://presigned.url/key'),
}));

jest.mock('sharp', () => {
  const chain = {
    metadata: jest.fn().mockResolvedValue({ width: 1920, height: 1080 }),
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
  };
  return jest.fn(() => chain);
});

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
  readFile: jest.fn().mockResolvedValue(Buffer.from('thumb')),
  unlink: jest.fn().mockResolvedValue(undefined),
}));

describe('MediaService', () => {
  let service: MediaService;
  let videoQueue: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, def?: any) => {
              const vals: Record<string, any> = {
                AWS_REGION: 'us-east-1',
                S3_ENDPOINT: 'http://localhost:9000',
                AWS_ACCESS_KEY_ID: 'minioadmin',
                AWS_SECRET_ACCESS_KEY: 'minioadmin',
                S3_BUCKET: 'connecthub-media',
                CDN_URL: 'http://localhost:9000/connecthub-media',
              };
              return vals[key] ?? def;
            }),
          },
        },
        {
          provide: getQueueToken(VIDEO_QUEUE),
          useValue: { add: jest.fn().mockResolvedValue({ id: 'job-1' }) },
        },
      ],
    }).compile();

    service = module.get(MediaService);
    videoQueue = module.get(getQueueToken(VIDEO_QUEUE));
  });

  describe('uploadFile — type validation', () => {
    it('throws BadRequestException for disallowed mime type', async () => {
      const buf = Buffer.from('data');
      await expect(
        service.uploadFile(buf, 'test.exe', 'application/x-msdownload', 'file'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for empty buffer', async () => {
      await expect(
        service.uploadFile(Buffer.alloc(0), 'test.jpg', 'image/jpeg', 'image'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when file exceeds size limit', async () => {
      const oversized = Buffer.alloc(MAX_SIZES.image + 1);
      await expect(
        service.uploadFile(oversized, 'big.jpg', 'image/jpeg', 'image'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('uploadFile — image', () => {
    it('processes image with sharp and uploads to S3', async () => {
      const buf = Buffer.from('image-data');
      const result = await service.uploadFile(buf, 'photo.jpg', 'image/jpeg', 'image');

      expect(result.mediaType).toBe('image');
      expect(result.url).toContain('http://localhost:9000/connecthub-media');
      expect(result.key).toContain('images/');
      expect(result.metadata).toHaveProperty('thumbnailUrl');
      expect(result.metadata).toHaveProperty('width');
    });
  });

  describe('uploadFile — voice', () => {
    it('uploads voice file directly without processing', async () => {
      const buf = Buffer.from('audio-data');
      const result = await service.uploadFile(buf, 'voice.ogg', 'audio/ogg', 'voice');

      expect(result.mediaType).toBe('voice');
      expect(result.key).toContain('voices/');
      expect(result.metadata.mimeType).toBe('audio/ogg');
    });
  });

  describe('uploadFile — file', () => {
    it('uploads generic file directly without processing', async () => {
      const buf = Buffer.from('pdf-content');
      const result = await service.uploadFile(buf, 'doc.pdf', 'application/pdf', 'file');

      expect(result.mediaType).toBe('file');
      expect(result.key).toContain('files/');
    });
  });

  describe('uploadFile — video', () => {
    it('saves video to S3 and enqueues thumbnail job without blocking', async () => {
      const buf = Buffer.from('video-data');
      const result = await service.uploadFile(buf, 'clip.mp4', 'video/mp4', 'video');

      expect(videoQueue.add).toHaveBeenCalledWith('generate-thumbnail', expect.objectContaining({ key: result.key }));
      expect(result.processingJobId).toBe('job-1');
      expect(result.mediaType).toBe('video');
      expect(result.key).toContain('videos/');
    });

    it('throws BadRequestException for disallowed video mime type', async () => {
      const buf = Buffer.from('video-data');
      await expect(
        service.uploadFile(buf, 'clip.avi', 'video/x-msvideo', 'video'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteFile', () => {
    it('sends DeleteObjectCommand to S3', async () => {
      await expect(service.deleteFile('images/some-key.webp')).resolves.not.toThrow();
    });
  });

  describe('getPresignedUrl', () => {
    it('returns a presigned URL string', async () => {
      const url = await service.getPresignedUrl('images/some-key.webp');
      expect(typeof url).toBe('string');
      expect(url).toContain('presigned');
    });
  });
});
