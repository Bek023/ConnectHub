import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getQueueToken } from '@nestjs/bullmq';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { MediaService, MAX_SIZES } from './media.service';
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

function assertHasProcessingJobId(value: unknown): asserts value is { processingJobId: string } {
  if (typeof value !== 'object' || value === null || !('processingJobId' in value)) {
    throw new Error('Expected uploadFile result to include processingJobId');
  }
}

const OWNER = 'user-uuid-1';
const jpegBuf = (payload = 'image-data') =>
  Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.from(payload)]);
const oggBuf = () => Buffer.concat([Buffer.from('OggS'), Buffer.from('audio-data')]);
const pdfBuf = () => Buffer.concat([Buffer.from('%PDF'), Buffer.from('pdf-content')]);
const mp4Buf = () =>
  Buffer.concat([Buffer.from([0x00, 0x00, 0x00, 0x18]), Buffer.from('ftyp'), Buffer.from('video')]);

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
        service.uploadFile(buf, 'test.exe', 'application/x-msdownload', 'file', OWNER),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for empty buffer', async () => {
      await expect(
        service.uploadFile(Buffer.alloc(0), 'test.jpg', 'image/jpeg', 'image', OWNER),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when file exceeds size limit', async () => {
      const oversized = Buffer.alloc(MAX_SIZES.image + 1);
      await expect(
        service.uploadFile(oversized, 'big.jpg', 'image/jpeg', 'image', OWNER),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when content does not match declared mime type', async () => {
      const buf = Buffer.from('not-a-real-image');
      await expect(
        service.uploadFile(buf, 'photo.jpg', 'image/jpeg', 'image', OWNER),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('uploadFile — image', () => {
    it('processes image with sharp and uploads to S3', async () => {
      const result = await service.uploadFile(jpegBuf(), 'photo.jpg', 'image/jpeg', 'image', OWNER);

      expect(result.mediaType).toBe('image');
      expect(result.url).toContain('http://localhost:9000/connecthub-media');
      expect(result.key).toContain(`images/${OWNER}/`);
      expect(result.key).toContain('.webp');
      expect(result.metadata).toHaveProperty('thumbnailUrl');
      expect(result.metadata).toHaveProperty('width');
    });
  });

  describe('uploadFile — voice', () => {
    it('uploads voice file directly without processing', async () => {
      const result = await service.uploadFile(oggBuf(), 'voice.ogg', 'audio/ogg', 'voice', OWNER);

      expect(result.mediaType).toBe('voice');
      expect(result.key).toContain(`voices/${OWNER}/`);
      expect(result.metadata.mimeType).toBe('audio/ogg');
    });
  });

  describe('uploadFile — file', () => {
    it('uploads generic file directly without processing', async () => {
      const result = await service.uploadFile(
        pdfBuf(),
        'doc.pdf',
        'application/pdf',
        'file',
        OWNER,
      );

      expect(result.mediaType).toBe('file');
      expect(result.key).toContain(`files/${OWNER}/`);
    });
  });

  describe('uploadFile — video', () => {
    it('saves video to S3 and enqueues thumbnail job without blocking', async () => {
      const result = await service.uploadFile(mp4Buf(), 'clip.mp4', 'video/mp4', 'video', OWNER);

      expect(videoQueue.add).toHaveBeenCalledWith(
        'generate-thumbnail',
        expect.objectContaining({ key: result.key }),
      );
      assertHasProcessingJobId(result);
      expect(result.processingJobId).toBe('job-1');
      expect(result.mediaType).toBe('video');
      expect(result.key).toContain(`videos/${OWNER}/`);
    });

    it('throws BadRequestException for disallowed video mime type', async () => {
      const buf = Buffer.from('video-data');
      await expect(
        service.uploadFile(buf, 'clip.avi', 'video/x-msvideo', 'video', OWNER),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteFile', () => {
    it('sends DeleteObjectCommand to S3 for own file', async () => {
      await expect(
        service.deleteFile(`images/${OWNER}/some-key.webp`, OWNER),
      ).resolves.not.toThrow();
    });

    it("rejects deleting another user's file", async () => {
      await expect(service.deleteFile('images/other-user/some-key.webp', OWNER)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getPresignedUrl', () => {
    it('returns a presigned URL string for own file', async () => {
      const url = await service.getPresignedUrl(`images/${OWNER}/some-key.webp`, OWNER);
      expect(typeof url).toBe('string');
      expect(url).toContain('presigned');
    });

    it("rejects presigning another user's file", async () => {
      await expect(
        service.getPresignedUrl('images/other-user/some-key.webp', OWNER),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
