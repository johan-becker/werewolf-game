/**
 * Logger Service
 * Implements ILogger interface using Winston
 */

import { injectable } from 'inversify';
import winston from 'winston';
import path from 'path';
import { ILogger } from '../../interfaces/core/logger.interface';

@injectable()
export class LoggerService implements ILogger {
  private readonly logger: winston.Logger;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || 'info';
    const logFile = process.env.LOG_FILE || 'logs/app.log';

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'werewolf-game' },
      transports: [
        new winston.transports.File({
          filename: path.join(process.cwd(), 'logs', 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(process.cwd(), logFile),
        }),
      ],
    });

    // Add console transport for non-production environments
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
      );
    }
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  error(message: string, error?: Error | any, meta?: any): void {
    if (error instanceof Error) {
      this.logger.error(message, { error: error.message, stack: error.stack, ...meta });
    } else {
      this.logger.error(message, { error, ...meta });
    }
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  verbose(message: string, meta?: any): void {
    this.logger.verbose(message, meta);
  }

  child(meta: any): ILogger {
    const childLogger = this.logger.child(meta);
    return {
      info: (message: string, childMeta?: any) => childLogger.info(message, childMeta),
      warn: (message: string, childMeta?: any) => childLogger.warn(message, childMeta),
      error: (message: string, error?: Error | any, childMeta?: any) => {
        if (error instanceof Error) {
          childLogger.error(message, { error: error.message, stack: error.stack, ...childMeta });
        } else {
          childLogger.error(message, { error, ...childMeta });
        }
      },
      debug: (message: string, childMeta?: any) => childLogger.debug(message, childMeta),
      verbose: (message: string, childMeta?: any) => childLogger.verbose(message, childMeta),
      child: (nestedMeta: any) => this.child({ ...meta, ...nestedMeta }),
    };
  }
}
