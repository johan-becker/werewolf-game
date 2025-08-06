/**
 * Database Service Interface
 */

import { PrismaClient } from '@prisma/client';

export interface MigrationRecord {
  id: string;
  name: string;
  executed_at: Date;
  checksum: string;
  execution_time_ms: number;
}

export interface MigrationFile {
  id: string;
  name: string;
  filename: string;
  sql: string;
  checksum: string;
}

export interface IDatabase {
  /**
   * Connect to database
   */
  connect(): Promise<void>;

  /**
   * Disconnect from database
   */
  disconnect(): Promise<void>;

  /**
   * Get Prisma client instance
   */
  getClient(): PrismaClient;

  /**
   * Execute raw SQL query
   */
  executeRaw(sql: string, params?: any[]): Promise<any>;

  /**
   * Query raw SQL
   */
  queryRaw<T = any>(sql: string, params?: any[]): Promise<T[]>;

  /**
   * Run database migrations
   */
  runMigrations(): Promise<void>;

  /**
   * Get migration status
   */
  getMigrationStatus(): Promise<{
    executed: MigrationRecord[];
    pending: MigrationFile[];
  }>;

  /**
   * Rollback last migration
   */
  rollbackLastMigration(): Promise<void>;

  /**
   * Create new migration file
   */
  createMigration(name: string): Promise<string>;

  /**
   * Validate database schema
   */
  validateSchema(): Promise<boolean>;

  /**
   * Get database health status
   */
  getHealthStatus(): Promise<{
    connected: boolean;
    latency: number;
    migrations: {
      executed: number;
      pending: number;
    };
  }>;
}
