/**
 * Database Service with Migration Management
 * Handles database connections, migrations, and versioning
 */

import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { IDatabase } from '../../interfaces/core/database.interface';
import { ILogger } from '../../interfaces/core/logger.interface';
import { IAppConfig } from '../../interfaces/config/app-config.interface';
import { TYPES } from '../../container/types';

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

@injectable()
export class DatabaseService implements IDatabase {
  private prisma: PrismaClient;
  private isConnected = false;

  constructor(
    @inject(TYPES.Logger) private readonly logger: ILogger,
    @inject(TYPES.AppConfig) private readonly config: IAppConfig
  ) {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: this.config.databaseUrl
        }
      },
      log: this.config.isDevelopment 
        ? ['query', 'info', 'warn', 'error']
        : ['error']
    });
  }

  /**
   * Connect to database
   */
  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.prisma.$connect();
        this.isConnected = true;
        this.logger.info('Database connected successfully');
        
        // Ensure migrations table exists
        await this.ensureMigrationsTable();
      } catch (error) {
        this.logger.error('Failed to connect to database', { error });
        throw error;
      }
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.prisma.$disconnect();
      this.isConnected = false;
      this.logger.info('Database disconnected');
    }
  }

  /**
   * Get Prisma client instance
   */
  getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Execute raw SQL query
   */
  async executeRaw(sql: string, params?: any[]): Promise<any> {
    return await this.prisma.$executeRawUnsafe(sql, ...(params || []));
  }

  /**
   * Query raw SQL
   */
  async queryRaw<T = any>(sql: string, params?: any[]): Promise<T[]> {
    return await this.prisma.$queryRawUnsafe(sql, ...(params || []));
  }

  /**
   * Run database migrations
   */
  async runMigrations(): Promise<void> {
    try {
      this.logger.info('Starting database migrations...');
      
      const migrationFiles = await this.loadMigrationFiles();
      const executedMigrations = await this.getExecutedMigrations();
      
      const pendingMigrations = migrationFiles.filter(
        migration => !executedMigrations.some(executed => executed.id === migration.id)
      );

      if (pendingMigrations.length === 0) {
        this.logger.info('No pending migrations found');
        return;
      }

      this.logger.info(`Found ${pendingMigrations.length} pending migrations`);

      for (const migration of pendingMigrations) {
        await this.executeMigration(migration);
      }

      this.logger.info('All migrations completed successfully');
    } catch (error) {
      this.logger.error('Migration failed', { error });
      throw error;
    }
  }

  /**
   * Get migration status
   */
  async getMigrationStatus(): Promise<{
    executed: MigrationRecord[];
    pending: MigrationFile[];
  }> {
    const migrationFiles = await this.loadMigrationFiles();
    const executedMigrations = await this.getExecutedMigrations();
    
    const pending = migrationFiles.filter(
      migration => !executedMigrations.some(executed => executed.id === migration.id)
    );

    return {
      executed: executedMigrations,
      pending
    };
  }

  /**
   * Rollback last migration
   */
  async rollbackLastMigration(): Promise<void> {
    const executedMigrations = await this.getExecutedMigrations();
    
    if (executedMigrations.length === 0) {
      throw new Error('No migrations to rollback');
    }

    const lastMigration = executedMigrations[executedMigrations.length - 1];
    
    // Check if rollback file exists
    const rollbackPath = path.join(
      __dirname, 
      '../../migrations/rollbacks', 
      `${lastMigration.id}_rollback.sql`
    );

    try {
      const rollbackSql = await fs.readFile(rollbackPath, 'utf-8');
      
      this.logger.info(`Rolling back migration: ${lastMigration.name}`);
      
      await this.prisma.$transaction(async (tx) => {
        // Execute rollback SQL
        await tx.$executeRawUnsafe(rollbackSql);
        
        // Remove migration record
        await tx.$executeRawUnsafe(
          'DELETE FROM _migrations WHERE id = $1',
          lastMigration.id
        );
      });

      this.logger.info(`Migration ${lastMigration.name} rolled back successfully`);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new Error(`Rollback file not found for migration: ${lastMigration.name}`);
      }
      throw error;
    }
  }

  /**
   * Create new migration file
   */
  async createMigration(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const migrationId = `${timestamp}_${name}`;
    const filename = `${migrationId}.sql`;
    
    const migrationDir = path.join(__dirname, '../../migrations');
    const migrationPath = path.join(migrationDir, filename);
    const rollbackPath = path.join(migrationDir, 'rollbacks', `${migrationId}_rollback.sql`);

    // Ensure directories exist
    await fs.mkdir(migrationDir, { recursive: true });
    await fs.mkdir(path.join(migrationDir, 'rollbacks'), { recursive: true });

    // Create migration template
    const migrationTemplate = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}
-- ID: ${migrationId}

-- Add your migration SQL here
-- Example:
-- CREATE TABLE example (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

`;

    // Create rollback template
    const rollbackTemplate = `-- Rollback for migration: ${name}
-- Created: ${new Date().toISOString()}
-- ID: ${migrationId}

-- Add your rollback SQL here
-- Example:
-- DROP TABLE IF EXISTS example;

`;

    await fs.writeFile(migrationPath, migrationTemplate);
    await fs.writeFile(rollbackPath, rollbackTemplate);

    this.logger.info(`Created migration files:
- Migration: ${migrationPath}
- Rollback: ${rollbackPath}`);

    return migrationId;
  }

  /**
   * Validate database schema
   */
  async validateSchema(): Promise<boolean> {
    try {
      // Check if all required tables exist
      const requiredTables = [
        'profiles', 'games', 'players', 'game_logs', 
        'chat_messages', 'game_role_configs', 'night_actions'
      ];

      for (const table of requiredTables) {
        const result = await this.queryRaw(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )`,
          [table]
        );

        if (!result[0]?.exists) {
          this.logger.error(`Required table '${table}' does not exist`);
          return false;
        }
      }

      this.logger.info('Database schema validation passed');
      return true;
    } catch (error) {
      this.logger.error('Schema validation failed', { error });
      return false;
    }
  }

  /**
   * Get database health status
   */
  async getHealthStatus(): Promise<{
    connected: boolean;
    latency: number;
    migrations: {
      executed: number;
      pending: number;
    };
  }> {
    const startTime = Date.now();
    
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;
      
      const migrationStatus = await this.getMigrationStatus();
      
      return {
        connected: true,
        latency,
        migrations: {
          executed: migrationStatus.executed.length,
          pending: migrationStatus.pending.length
        }
      };
    } catch (error) {
      return {
        connected: false,
        latency: -1,
        migrations: {
          executed: 0,
          pending: 0
        }
      };
    }
  }

  /**
   * Private: Ensure migrations table exists
   */
  private async ensureMigrationsTable(): Promise<void> {
    await this.prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS _migrations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW(),
        checksum VARCHAR(255) NOT NULL,
        execution_time_ms INTEGER NOT NULL
      )
    `;
  }

  /**
   * Private: Load migration files from disk
   */
  private async loadMigrationFiles(): Promise<MigrationFile[]> {
    const migrationDir = path.join(__dirname, '../../migrations');
    
    try {
      const files = await fs.readdir(migrationDir);
      const migrationFiles: MigrationFile[] = [];

      for (const file of files) {
        if (file.endsWith('.sql') && !file.includes('rollback')) {
          const filePath = path.join(migrationDir, file);
          const sql = await fs.readFile(filePath, 'utf-8');
          const checksum = this.calculateChecksum(sql);
          
          // Extract ID and name from filename
          const match = file.match(/^(\d+_\w+)\.sql$/);
          if (match) {
            const id = match[1];
            const name = id.split('_').slice(1).join('_');
            
            migrationFiles.push({
              id,
              name,
              filename: file,
              sql,
              checksum
            });
          }
        }
      }

      return migrationFiles.sort((a, b) => a.id.localeCompare(b.id));
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        this.logger.warn('Migrations directory not found, creating it...');
        await fs.mkdir(migrationDir, { recursive: true });
        return [];
      }
      throw error;
    }
  }

  /**
   * Private: Get executed migrations from database
   */
  private async getExecutedMigrations(): Promise<MigrationRecord[]> {
    try {
      return await this.queryRaw<MigrationRecord>(
        'SELECT * FROM _migrations ORDER BY executed_at ASC'
      );
    } catch (error) {
      // If table doesn't exist, return empty array
      return [];
    }
  }

  /**
   * Private: Execute a single migration
   */
  private async executeMigration(migration: MigrationFile): Promise<void> {
    const startTime = Date.now();
    
    this.logger.info(`Executing migration: ${migration.name}`);
    
    try {
      await this.prisma.$transaction(async (tx) => {
        // Execute migration SQL
        await tx.$executeRawUnsafe(migration.sql);
        
        // Record migration
        await tx.$executeRawUnsafe(
          `INSERT INTO _migrations (id, name, checksum, execution_time_ms) 
           VALUES ($1, $2, $3, $4)`,
          migration.id,
          migration.name,
          migration.checksum,
          Date.now() - startTime
        );
      });

      this.logger.info(`Migration ${migration.name} completed in ${Date.now() - startTime}ms`);
    } catch (error) {
      this.logger.error(`Migration ${migration.name} failed`, { error });
      throw error;
    }
  }

  /**
   * Private: Calculate checksum for migration content
   */
  private calculateChecksum(content: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(content).digest('hex');
  }
}