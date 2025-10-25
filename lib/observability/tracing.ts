import { createLogger, LogContext } from './logger';

export interface TraceSpan {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  context: LogContext;
  children: TraceSpan[];
}

export class PostLikeTracer {
  private spans: TraceSpan[] = [];
  private currentSpan: TraceSpan | null = null;

  constructor(private logger = createLogger()) {}

  startSpan(name: string, context: LogContext = {}): TraceSpan {
    const span: TraceSpan = {
      name,
      startTime: Date.now(),
      context,
      children: [],
    };

    if (this.currentSpan) {
      this.currentSpan.children.push(span);
    } else {
      this.spans.push(span);
    }

    this.currentSpan = span;
    return span;
  }

  endSpan(span: TraceSpan): void {
    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;

    this.logger.info(`Span completed: ${span.name}`, {
      ...span.context,
      duration_ms: span.duration,
    });

    // Move back to parent span
    if (this.currentSpan === span) {
      this.currentSpan = this.findParentSpan(span);
    }
  }

  private findParentSpan(childSpan: TraceSpan): TraceSpan | null {
    for (const span of this.spans) {
      if (this.findSpanInChildren(span, childSpan)) {
        return span;
      }
    }
    return null;
  }

  private findSpanInChildren(parent: TraceSpan, target: TraceSpan): boolean {
    if (parent.children.includes(target)) {
      return true;
    }
    return parent.children.some(child => this.findSpanInChildren(child, target));
  }

  // Convenience methods for common operations
  async traceDatabaseOperation<T>(
    operation: string,
    context: LogContext,
    fn: () => Promise<T>
  ): Promise<T> {
    const span = this.startSpan(`db.${operation}`, context);
    
    try {
      const result = await fn();
      this.endSpan(span);
      return result;
    } catch (error) {
      this.endSpan(span);
      throw error;
    }
  }

  async traceApiCall<T>(
    endpoint: string,
    context: LogContext,
    fn: () => Promise<T>
  ): Promise<T> {
    const span = this.startSpan(`api.${endpoint}`, context);
    
    try {
      const result = await fn();
      this.endSpan(span);
      return result;
    } catch (error) {
      this.endSpan(span);
      throw error;
    }
  }

  // Get all spans for debugging
  getAllSpans(): TraceSpan[] {
    return [...this.spans];
  }

  // Clear all spans
  clear(): void {
    this.spans = [];
    this.currentSpan = null;
  }
}

// Create tracer instance
export function createTracer(): PostLikeTracer {
  return new PostLikeTracer();
}
