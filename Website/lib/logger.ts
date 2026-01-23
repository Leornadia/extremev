/**
 * Structured Logger
 *
 * Provides consistent logging format for better log aggregation and analysis
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMeta {
  [key: string]: any;
}

class Logger {
  private formatLog(level: LogLevel, message: string, meta?: LogMeta) {
    return JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      ...meta,
    });
  }

  info(message: string, meta?: LogMeta) {
    console.log(this.formatLog('info', message, meta));
  }

  warn(message: string, meta?: LogMeta) {
    console.warn(this.formatLog('warn', message, meta));
  }

  error(message: string, error?: Error, meta?: LogMeta) {
    console.error(
      this.formatLog('error', message, {
        error: error?.message,
        stack: error?.stack,
        ...meta,
      })
    );
  }

  debug(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatLog('debug', message, meta));
    }
  }
}

export const logger = new Logger();
