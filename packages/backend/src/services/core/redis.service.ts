/**
 * Redis Service for Session Management and Caching
 */

import { injectable, inject } from 'inversify';
import Redis from 'ioredis';
import { IRedis } from '../../interfaces/core/redis.interface';
import { IAppConfig } from '../../interfaces/config/app-config.interface';
import { TYPES } from '../../container/types';

@injectable()
export class RedisService implements IRedis {
  private client: Redis;
  private isConnected = false;

  constructor(@inject(TYPES.AppConfig) private readonly config: IAppConfig) {
    this.client = new Redis(this.config.redisUrl, {
      enableReadyCheck: false,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
    });

    this.setupEventHandlers();
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    await this.client.setex(key, seconds, value);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      // Redis connected
      this.isConnected = true;
    });

    this.client.on('error', error => {
      // Redis error handled
      this.isConnected = false;
    });

    this.client.on('close', () => {
      // Redis connection closed
      this.isConnected = false;
    });
  }
}
