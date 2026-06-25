import { ConfigService } from '@nestjs/config';
import type { types as MediasoupTypes } from 'mediasoup';

export const mediasoupConfig = (config: ConfigService) => ({
  listenIp: config.get('MEDIASOUP_LISTEN_IP', '0.0.0.0'),
  announcedIp: config.get('MEDIASOUP_ANNOUNCED_IP'),
  minPort: config.get<number>('MEDIASOUP_MIN_PORT', 10000),
  maxPort: config.get<number>('MEDIASOUP_MAX_PORT', 20000),
  mediaCodecs: [
    { kind: 'audio', mimeType: 'audio/opus', clockRate: 48000, channels: 2 },
    { kind: 'video', mimeType: 'video/VP8', clockRate: 90000 },
  ] as MediasoupTypes.RouterRtpCodecCapability[],
});
