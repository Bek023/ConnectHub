import { CacheInterceptor as NestCacheInterceptor } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheInterceptor extends NestCacheInterceptor {}
