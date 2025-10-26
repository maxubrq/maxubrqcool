/**
 * Redis Helper Functions for Quiz System
 * Handles data persistence, caching, and analytics storage
 */

import { QuizResult, QuizStats } from './types';

export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { ex?: number }): Promise<string>;
  del(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, field: string, value: string): Promise<number>;
  hincrby(key: string, field: string, increment: number): Promise<number>;
  hgetall(key: string): Promise<Record<string, string>>;
  sadd(key: string, member: string): Promise<number>;
  smembers(key: string): Promise<string[]>;
  zadd(key: string, score: number, member: string): Promise<number>;
  zrange(key: string, start: number, stop: number): Promise<string[]>;
  expire(key: string, seconds: number): Promise<number>;
}

export class QuizRedisClient {
  private redis: RedisClient;
  private namespace: string;

  constructor(redis: RedisClient, namespace: string = 'quiz:') {
    this.redis = redis;
    this.namespace = namespace;
  }

  // Quiz result storage
  async storeQuizResult(
    quizId: string, 
    resultId: string, 
    result: QuizResult,
    metadata?: Record<string, any>
  ): Promise<void> {
    const key = `${this.namespace}result:${quizId}:${resultId}`;
    const data = {
      quizId,
      resultId,
      result,
      metadata,
      timestamp: Date.now()
    };
    
    await this.redis.set(key, JSON.stringify(data), { ex: 86400 * 30 }); // 30 days
  }

  async getQuizResult(quizId: string, resultId: string): Promise<any> {
    const key = `${this.namespace}result:${quizId}:${resultId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Quiz statistics
  async updateQuizStats(quizId: string, result: QuizResult): Promise<void> {
    // Increment attempt count
    await this.redis.incr(`${this.namespace}stats:${quizId}:attempts`);
    
    // Update completion rate
    await this.redis.hincrby(`${this.namespace}stats:${quizId}`, 'completions', 1);
    
    // Update score histogram
    const scoreRange = Math.floor((result.score / result.maxScore) * 10) * 10;
    await this.redis.hincrby(`${this.namespace}stats:${quizId}:histogram`, `${scoreRange}-${scoreRange + 9}`, 1);
    
    // Update per-question stats
    for (const questionResult of result.perQuestion) {
      const questionKey = `${this.namespace}stats:${quizId}:question:${questionResult.id}`;
      await this.redis.hincrby(questionKey, 'attempts', 1);
      if (questionResult.correct) {
        await this.redis.hincrby(questionKey, 'correct', 1);
      }
    }
  }

  async getQuizStats(quizId: string): Promise<QuizStats | null> {
    try {
      const attempts = await this.redis.get(`${this.namespace}stats:${quizId}:attempts`);
      const stats = await this.redis.hgetall(`${this.namespace}stats:${quizId}`);
      const histogram = await this.redis.hgetall(`${this.namespace}stats:${quizId}:histogram`);
      
      if (!attempts) return null;

      const attemptCount = parseInt(attempts);
      const completionCount = parseInt(stats.completions || '0');
      
      return {
        attempts: attemptCount,
        completionRate: attemptCount > 0 ? completionCount / attemptCount : 0,
        avgTimePerQuestion: 0, // Would need to track this separately
        perQuestionStats: [], // Would need to aggregate from question stats
        scoreHistogram: Object.entries(histogram).map(([range, count]) => ({
          scoreRange: range,
          count: parseInt(count)
        })),
        streakDistribution: [] // Would need to track streaks
      };
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      return null;
    }
  }

  // Analytics events
  async storeAnalyticsEvent(
    event: string,
    quizId: string,
    properties?: Record<string, any>
  ): Promise<void> {
    const key = `${this.namespace}events:${Date.now()}`;
    const data = {
      event,
      quizId,
      properties,
      timestamp: Date.now()
    };
    
    await this.redis.set(key, JSON.stringify(data), { ex: 86400 * 30 }); // 30 days
  }

  async getAnalyticsEvents(
    quizId: string,
    startTime?: number,
    endTime?: number
  ): Promise<any[]> {
    // This would need a more sophisticated implementation
    // For now, return empty array
    return [];
  }

  // Quiz configuration caching
  async cacheQuizConfig(quizId: string, config: any): Promise<void> {
    const key = `${this.namespace}config:${quizId}`;
    await this.redis.set(key, JSON.stringify(config), { ex: 3600 }); // 1 hour
  }

  async getQuizConfig(quizId: string): Promise<any> {
    const key = `${this.namespace}config:${quizId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // User progress tracking
  async saveUserProgress(
    userId: string,
    quizId: string,
    progress: {
      currentQuestionIndex: number;
      answers: Record<string, any>;
      startTime: number;
    }
  ): Promise<void> {
    const key = `${this.namespace}progress:${userId}:${quizId}`;
    await this.redis.set(key, JSON.stringify(progress), { ex: 86400 }); // 24 hours
  }

  async getUserProgress(userId: string, quizId: string): Promise<any> {
    const key = `${this.namespace}progress:${userId}:${quizId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async clearUserProgress(userId: string, quizId: string): Promise<void> {
    const key = `${this.namespace}progress:${userId}:${quizId}`;
    await this.redis.del(key);
  }

  // Rate limiting
  async checkRateLimit(
    identifier: string,
    limit: number = 60,
    windowSeconds: number = 60
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `${this.namespace}rate_limit:${identifier}`;
    const current = await this.redis.get(key);
    
    if (!current) {
      await this.redis.set(key, '1', { ex: windowSeconds });
      return { allowed: true, remaining: limit - 1, resetTime: Date.now() + windowSeconds * 1000 };
    }
    
    const count = parseInt(current);
    if (count >= limit) {
      return { allowed: false, remaining: 0, resetTime: Date.now() + windowSeconds * 1000 };
    }
    
    await this.redis.incr(key);
    return { allowed: true, remaining: limit - count - 1, resetTime: Date.now() + windowSeconds * 1000 };
  }

  // Cleanup old data
  async cleanupOldData(daysToKeep: number = 30): Promise<void> {
    const cutoffTime = Date.now() - (daysToKeep * 86400 * 1000);
    
    // This would need a more sophisticated implementation
    // For now, just log the intention
    console.log(`Cleaning up data older than ${daysToKeep} days (before ${new Date(cutoffTime)})`);
  }
}

// Factory function to create Redis client
export function createQuizRedisClient(
  redis: RedisClient, 
  namespace: string = 'quiz:'
): QuizRedisClient {
  return new QuizRedisClient(redis, namespace);
}

// Mock Redis client for development
export class MockRedisClient implements RedisClient {
  private data: Map<string, string> = new Map();
  private expirations: Map<string, number> = new Map();

  async get(key: string): Promise<string | null> {
    const expiration = this.expirations.get(key);
    if (expiration && Date.now() > expiration) {
      this.data.delete(key);
      this.expirations.delete(key);
      return null;
    }
    return this.data.get(key) || null;
  }

  async set(key: string, value: string, options?: { ex?: number }): Promise<string> {
    this.data.set(key, value);
    if (options?.ex) {
      this.expirations.set(key, Date.now() + options.ex * 1000);
    }
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.data.has(key);
    this.data.delete(key);
    this.expirations.delete(key);
    return existed ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const newValue = (current ? parseInt(current) : 0) + 1;
    await this.set(key, newValue.toString());
    return newValue;
  }

  async hget(key: string, field: string): Promise<string | null> {
    const data = await this.get(key);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return parsed[field] || null;
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    const data = await this.get(key);
    const parsed = data ? JSON.parse(data) : {};
    parsed[field] = value;
    await this.set(key, JSON.stringify(parsed));
    return 1;
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    const current = await this.hget(key, field);
    const newValue = (current ? parseInt(current) : 0) + increment;
    await this.hset(key, field, newValue.toString());
    return newValue;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    const data = await this.get(key);
    return data ? JSON.parse(data) : {};
  }

  async sadd(key: string, member: string): Promise<number> {
    // Simplified implementation
    return 1;
  }

  async smembers(key: string): Promise<string[]> {
    return [];
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    return 1;
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return [];
  }

  async expire(key: string, seconds: number): Promise<number> {
    this.expirations.set(key, Date.now() + seconds * 1000);
    return 1;
  }
}
