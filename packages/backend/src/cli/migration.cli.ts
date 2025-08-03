#!/usr/bin/env node

/**
 * Database Migration CLI Tool
 * Command-line interface for managing database migrations
 */

import { Command } from 'commander';
import { container } from '../container/container';
import { TYPES } from '../container/types';
import { IDatabase } from '../interfaces/core/database.interface';
import 'reflect-metadata';

const program = new Command();
const database = container.get<IDatabase>(TYPES.Database);

program
  .name('migration')
  .description('Database migration management tool')
  .version('1.0.0');

/**
 * Run pending migrations
 */
program
  .command('run')
  .description('Run all pending migrations')
  .action(async () => {
    try {
      await database.connect();
      await database.runMigrations();
      // eslint-disable-next-line no-console
      console.log('✅ All migrations completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  });

/**
 * Show migration status
 */
program
  .command('status')
  .description('Show migration status')
  .action(async () => {
    try {
      await database.connect();
      const status = await database.getMigrationStatus();
      
      // eslint-disable-next-line no-console
      console.log('\n📊 Migration Status:');
      // eslint-disable-next-line no-console
      console.log(`Executed: ${status.executed.length}`);
      // eslint-disable-next-line no-console
      console.log(`Pending: ${status.pending.length}`);
      
      if (status.executed.length > 0) {
        console.log('\n✅ Executed Migrations:');
        status.executed.forEach(migration => {
          console.log(`  ${migration.id} - ${migration.name} (${migration.executed_at.toISOString()})`);
        });
      }
      
      if (status.pending.length > 0) {
        console.log('\n⏳ Pending Migrations:');
        status.pending.forEach(migration => {
          console.log(`  ${migration.id} - ${migration.name}`);
        });
      }
      
      if (status.pending.length === 0 && status.executed.length > 0) {
        console.log('\n🎉 Database is up to date!');
      }
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Failed to get migration status:', error);
      process.exit(1);
    }
  });

/**
 * Create new migration
 */
program
  .command('create <name>')
  .description('Create a new migration file')
  .action(async (name: string) => {
    try {
      await database.connect();
      const migrationId = await database.createMigration(name);
      console.log(`✅ Created migration: ${migrationId}`);
      console.log('📝 Edit the migration files and run "migration run" to apply');
      process.exit(0);
    } catch (error) {
      console.error('❌ Failed to create migration:', error);
      process.exit(1);
    }
  });

/**
 * Rollback last migration
 */
program
  .command('rollback')
  .description('Rollback the last migration')
  .option('-f, --force', 'Force rollback without confirmation')
  .action(async (options) => {
    try {
      await database.connect();
      const status = await database.getMigrationStatus();
      
      if (status.executed.length === 0) {
        console.log('ℹ️  No migrations to rollback');
        process.exit(0);
      }
      
      const lastMigration = status.executed[status.executed.length - 1];
      
      if (!lastMigration) {
        console.error('❌ No valid migration found to rollback');
        process.exit(1);
      }
      
      if (!options.force) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise((resolve) => {
          readline.question(
            `⚠️  Are you sure you want to rollback "${lastMigration.name}"? (y/N): `,
            resolve
          );
        });
        
        readline.close();
        
        if (answer !== 'y' && answer !== 'Y') {
          console.log('Rollback cancelled');
          process.exit(0);
        }
      }
      
      await database.rollbackLastMigration();
      console.log(`✅ Rolled back migration: ${lastMigration.name}`);
      process.exit(0);
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      process.exit(1);
    }
  });

/**
 * Validate database schema
 */
program
  .command('validate')
  .description('Validate database schema')
  .action(async () => {
    try {
      await database.connect();
      const isValid = await database.validateSchema();
      
      if (isValid) {
        console.log('✅ Database schema is valid');
        process.exit(0);
      } else {
        console.log('❌ Database schema validation failed');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Schema validation error:', error);
      process.exit(1);
    }
  });

/**
 * Show database health status
 */
program
  .command('health')
  .description('Show database health status')
  .action(async () => {
    try {
      const health = await database.getHealthStatus();
      
      console.log('\n🏥 Database Health Status:');
      console.log(`Connected: ${health.connected ? '✅' : '❌'}`);
      console.log(`Latency: ${health.latency}ms`);
      console.log(`Executed Migrations: ${health.migrations.executed}`);
      console.log(`Pending Migrations: ${health.migrations.pending}`);
      
      if (health.migrations.pending > 0) {
        console.log('\n⚠️  There are pending migrations. Run "migration run" to apply them.');
      }
      
      process.exit(health.connected ? 0 : 1);
    } catch (error) {
      console.error('❌ Health check failed:', error);
      process.exit(1);
    }
  });

/**
 * Reset database (dangerous!)
 */
program
  .command('reset')
  .description('Reset database (DANGEROUS: removes all data)')
  .option('--confirm-reset', 'Confirm you want to reset the database')
  .action(async (options) => {
    if (!options.confirmReset) {
      console.error('❌ Database reset requires --confirm-reset flag');
      console.error('⚠️  WARNING: This will DELETE ALL DATA in the database!');
      process.exit(1);
    }
    
    try {
      await database.connect();
      
      // Get all executed migrations in reverse order
      const status = await database.getMigrationStatus();
      const migrations = [...status.executed].reverse();
      
      console.log(`🔄 Rolling back ${migrations.length} migrations...`);
      
      for (const migration of migrations) {
        try {
          await database.rollbackLastMigration();
          console.log(`✅ Rolled back: ${migration.name}`);
        } catch (error) {
          console.warn(`⚠️  Could not rollback ${migration.name}:`, error);
        }
      }
      
      console.log('✅ Database reset completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      process.exit(1);
    }
  });

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});

// Parse command line arguments
program.parse();