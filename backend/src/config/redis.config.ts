import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  constructor(private config: ConfigService) {
    const redisConfig = {
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
      password: this.config.get('REDIS_PASSWORD'),
      retryStrategy: (times: number) => Math.min(times * 100, 3000),
    };

    this.client = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    this.publisher = new Redis(redisConfig);

    this.client.on('error', (e) => console.error('Redis xatosi:', e));
  }

  async get(key: string) {
    return this.client.get(key);
  }
  async set(key: string, value: string) {
    return this.client.set(key, value);
  }
  async setex(key: string, seconds: number, value: string) {
    return this.client.setex(key, seconds, value);
  }
  async del(key: string) {
    return this.client.del(key);
  }
  async exists(key: string) {
    return this.client.exists(key);
  }
  async incr(key: string) {
    return this.client.incr(key);
  }
  async expire(key: string, seconds: number) {
    return this.client.expire(key, seconds);
  }

  async sadd(key: string, ...members: string[]) {
    return this.client.sadd(key, ...members);
  }
  async srem(key: string, ...members: string[]) {
    return this.client.srem(key, ...members);
  }
  async smembers(key: string) {
    return this.client.smembers(key);
  }

  async hset(key: string, field: string, value: string) {
    return this.client.hset(key, field, value);
  }
  async hget(key: string, field: string) {
    return this.client.hget(key, field);
  }
  async hgetall(key: string) {
    return this.client.hgetall(key);
  }

  async getOrSet<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T> {
    const cached = await this.get(key);
    if (cached) return JSON.parse(cached);
    const value = await factory();
    await this.setex(key, ttl, JSON.stringify(value));
    return value;
  }

  async publish(channel: string, message: object) {
    return this.publisher.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, handler: (msg: any) => void) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) handler(JSON.parse(msg));
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
    this.subscriber.disconnect();
    this.publisher.disconnect();
  }
}
