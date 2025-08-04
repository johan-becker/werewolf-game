/**
 * Logger Interface
 * Defines the contract for logging services
 */

export interface ILogger {
  /**
   * Log an informational message
   */
  info(message: string, meta?: any): void;

  /**
   * Log a warning message
   */
  warn(message: string, meta?: any): void;

  /**
   * Log an error message
   */
  error(message: string, error?: Error | any, meta?: any): void;

  /**
   * Log a debug message
   */
  debug(message: string, meta?: any): void;

  /**
   * Log a verbose message
   */
  verbose(message: string, meta?: any): void;

  /**
   * Create a child logger with additional context
   */
  child(meta: any): ILogger;
}
