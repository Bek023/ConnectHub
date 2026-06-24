import { ConfigService } from '@nestjs/config';

export const s3Config = (config: ConfigService) => ({
  region: config.get('AWS_REGION'),
  endpoint: config.get('S3_ENDPOINT'),
  credentials: {
    accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
  },
  bucket: config.get('S3_BUCKET'),
  cdnUrl: config.get('CDN_URL'),
});
