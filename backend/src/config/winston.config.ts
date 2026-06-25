import * as winston from 'winston';
import { WinstonModuleOptions, utilities as nestWinstonUtilities } from 'nest-winston';

const isProduction = process.env.NODE_ENV === 'production';

export const winstonConfig: WinstonModuleOptions = {
  level: isProduction ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonUtilities.format.nestLike('ConnectHub', {
          colors: !isProduction,
          prettyPrint: !isProduction,
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
};
