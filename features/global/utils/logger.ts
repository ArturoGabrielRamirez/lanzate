/**
 * Logger utility for consistent logging across the application
 * In production, errors are logged but warnings and info are suppressed
 */

type LogLevel = 'info' | 'warn' | 'error';

const shouldLog = (level: LogLevel): boolean => {
  if (process.env.NODE_ENV === 'production') {
    // Only log errors in production
    return level === 'error';
  }
  return true;
};

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  error: (message: string, error?: unknown) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error);
      
      // In production, you might want to send errors to a monitoring service
      // Example: Sentry, LogRocket, etc.
      if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with error monitoring service
        // Sentry.captureException(error);
      }
    }
  },
};

