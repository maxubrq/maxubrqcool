import { hashIP } from '@/lib/rate-limit';

export interface LogContext {
  ip_hash?: string;
  post_id?: string;
  operation?: string;
  count?: number;
  duration_ms?: number;
  error?: string;
  retry_after?: number;
  user_agent?: string;
  request_id?: string;
}

export interface Metrics {
  like_attempts: number;
  like_success: number;
  unlike_success: number;
  rate_limited: number;
  db_errors: number;
  validation_errors: number;
  internal_errors: number;
}

// Simple in-memory metrics store
// In production, use proper metrics collection (DataDog, New Relic, etc.)
const metrics: Metrics = {
  like_attempts: 0,
  like_success: 0,
  unlike_success: 0,
  rate_limited: 0,
  db_errors: 0,
  validation_errors: 0,
  internal_errors: 0,
};

export function getMetrics(): Metrics {
  return { ...metrics };
}

export function resetMetrics(): void {
  Object.keys(metrics).forEach(key => {
    metrics[key as keyof Metrics] = 0;
  });
}

export function incrementMetric(metric: keyof Metrics): void {
  metrics[metric]++;
}

export class PostLikeLogger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  private log(level: 'info' | 'warn' | 'error', message: string, additionalContext: LogContext = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...additionalContext,
    };

    // In production, use structured logging (Winston, Pino, etc.)
    if (level === 'error') {
      console.error(JSON.stringify(logEntry));
    } else if (level === 'warn') {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.info(JSON.stringify(logEntry));
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  // Specific logging methods for post like operations
  likeAttempt(postId: string, ipHash: string): void {
    incrementMetric('like_attempts');
    this.info('Like attempt', {
      post_id: postId,
      ip_hash: ipHash,
    });
  }

  likeSuccess(postId: string, count: number, duration: number, ipHash: string): void {
    incrementMetric('like_success');
    this.info('Like operation successful', {
      post_id: postId,
      count,
      duration_ms: duration,
      ip_hash: ipHash,
    });
  }

  unlikeSuccess(postId: string, count: number, duration: number, ipHash: string): void {
    incrementMetric('unlike_success');
    this.info('Unlike operation successful', {
      post_id: postId,
      count,
      duration_ms: duration,
      ip_hash: ipHash,
    });
  }

  rateLimitExceeded(ipHash: string, retryAfter: number): void {
    incrementMetric('rate_limited');
    this.warn('Rate limit exceeded', {
      ip_hash: ipHash,
      retry_after: retryAfter,
    });
  }

  databaseError(postId: string, operation: string, error: string, ipHash: string): void {
    incrementMetric('db_errors');
    this.error('Database operation failed', {
      post_id: postId,
      operation,
      error,
      ip_hash: ipHash,
    });
  }

  validationError(postId: string, errors: any, ipHash: string): void {
    incrementMetric('validation_errors');
    this.warn('Validation error', {
      post_id: postId,
      error: errors?.message,
      ip_hash: ipHash,
    });
  }

  internalError(error: string, stack?: string, ipHash?: string): void {
    incrementMetric('internal_errors');
    this.error('Internal server error', {
      error,
      ip_hash: ipHash,
    });
  }

  getCountSuccess(postId: string, count: number, duration: number, ipHash: string): void {
    this.info('Get like count successful', {
      post_id: postId,
      count,
      duration_ms: duration,
      ip_hash: ipHash,
    });
  }

  getCountError(postId: string, error: string, ipHash: string): void {
    this.error('Get like count failed', {
      post_id: postId,
      error,
      ip_hash: ipHash,
    });
  }
}

// Create logger instance
export function createLogger(context: LogContext = {}): PostLikeLogger {
  return new PostLikeLogger(context);
}

// Utility function to create request context
export function createRequestContext(
  request: Request,
  postId?: string,
  operation?: string
): LogContext {
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
  const ipHash = hashIP(clientIP);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  return {
    ip_hash: ipHash,
    post_id: postId,
    operation,
    user_agent: userAgent,
    request_id: requestId,
  };
}
