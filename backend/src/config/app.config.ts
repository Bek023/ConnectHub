import { ConfigService } from '@nestjs/config';

export const appConfig = (config: ConfigService) => ({
  port: config.get<number>('PORT', 4000),
  frontendUrl: config.get('FRONTEND_URL'),
  nodeEnv: config.get('NODE_ENV', 'development'),
});
