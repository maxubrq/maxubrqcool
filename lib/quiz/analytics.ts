/**
 * Quiz Analytics System
 * Handles analytics events, metrics collection, and dashboard data
 */

import { QuizAnalyticsEvent, QuizStats } from './types';

// Analytics event types
export type AnalyticsEvent = 
  | 'quiz.view'
  | 'quiz.start'
  | 'quiz.select_choice'
  | 'quiz.reveal_question'
  | 'quiz.finish'
  | 'quiz.review_open'
  | 'quiz.copy_mdx'
  | 'quiz.admin.save';

export interface AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
}

// Mock analytics provider - replace with actual implementation
class MockAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: Record<string, any>): void {
    console.log(`[Analytics] ${event}:`, properties);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    console.log(`[Analytics] Identify ${userId}:`, traits);
  }

  page(name: string, properties?: Record<string, any>): void {
    console.log(`[Analytics] Page ${name}:`, properties);
  }
}

// PostHog analytics provider
class PostHogAnalyticsProvider implements AnalyticsProvider {
  private posthog: any;

  constructor(posthog: any) {
    this.posthog = posthog;
  }

  track(event: AnalyticsEvent, properties?: Record<string, any>): void {
    this.posthog.capture(event, properties);
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.posthog.identify(userId, traits);
  }

  page(name: string, properties?: Record<string, any>): void {
    this.posthog.capture('$pageview', { page: name, ...properties });
  }
}

// Custom Redis analytics provider
class RedisAnalyticsProvider implements AnalyticsProvider {
  private redis: any;
  private namespace: string;

  constructor(redis: any, namespace: string = 'quiz:') {
    this.redis = redis;
    this.namespace = namespace;
  }

  track(event: AnalyticsEvent, properties?: Record<string, any>): void {
    const key = `${this.namespace}events:${Date.now()}`;
    const data = {
      event,
      properties,
      timestamp: Date.now()
    };
    this.redis.setex(key, 86400 * 30, JSON.stringify(data)); // 30 days
  }

  identify(userId: string, traits?: Record<string, any>): void {
    const key = `${this.namespace}user:${userId}`;
    this.redis.hset(key, traits || {});
    this.redis.expire(key, 86400 * 90); // 90 days
  }

  page(name: string, properties?: Record<string, any>): void {
    this.track('quiz.view', { page: name, ...properties });
  }
}

// Analytics manager
export class QuizAnalytics {
  private provider: AnalyticsProvider;

  constructor(provider: AnalyticsProvider) {
    this.provider = provider;
  }

  // Track quiz events
  trackQuizView(quizId: string, metadata?: Record<string, any>): void {
    this.provider.track('quiz.view', { quizId, ...metadata });
  }

  trackQuizStart(quizId: string, metadata?: Record<string, any>): void {
    this.provider.track('quiz.start', { quizId, ...metadata });
  }

  trackChoiceSelection(quizId: string, questionId: string, choiceId: string, metadata?: Record<string, any>): void {
    this.provider.track('quiz.select_choice', { 
      quizId, 
      questionId, 
      choiceId, 
      ...metadata 
    });
  }

  trackQuestionReveal(quizId: string, questionId: string, metadata?: Record<string, any>): void {
    this.provider.track('quiz.reveal_question', { 
      quizId, 
      questionId, 
      ...metadata 
    });
  }

  trackQuizFinish(quizId: string, result: any, metadata?: Record<string, any>): void {
    this.provider.track('quiz.finish', { 
      quizId, 
      score: result.score,
      maxScore: result.maxScore,
      correctCount: result.correctCount,
      total: result.total,
      ...metadata 
    });
  }

  trackReviewOpen(quizId: string, metadata?: Record<string, any>): void {
    this.provider.track('quiz.review_open', { quizId, ...metadata });
  }

  trackMDXCopy(quizId: string, metadata?: Record<string, any>): void {
    this.provider.track('quiz.copy_mdx', { quizId, ...metadata });
  }

  trackAdminSave(quizId: string, metadata?: Record<string, any>): void {
    this.provider.track('quiz.admin.save', { quizId, ...metadata });
  }

  // User identification
  identifyUser(userId: string, traits?: Record<string, any>): void {
    this.provider.identify(userId, traits);
  }

  // Page tracking
  trackPage(name: string, properties?: Record<string, any>): void {
    this.provider.page(name, properties);
  }
}

// Analytics factory
export function createAnalytics(provider: 'mock' | 'posthog' | 'redis', config?: any): QuizAnalytics {
  switch (provider) {
    case 'posthog':
      return new QuizAnalytics(new PostHogAnalyticsProvider(config));
    case 'redis':
      return new QuizAnalytics(new RedisAnalyticsProvider(config.redis, config.namespace));
    case 'mock':
    default:
      return new QuizAnalytics(new MockAnalyticsProvider());
  }
}

// Analytics hooks for React components
export function useQuizAnalytics(quizId: string) {
  const analytics = createAnalytics('mock'); // In production, use proper provider

  return {
    trackView: (metadata?: Record<string, any>) => analytics.trackQuizView(quizId, metadata),
    trackStart: (metadata?: Record<string, any>) => analytics.trackQuizStart(quizId, metadata),
    trackChoice: (questionId: string, choiceId: string, metadata?: Record<string, any>) => 
      analytics.trackChoiceSelection(quizId, questionId, choiceId, metadata),
    trackReveal: (questionId: string, metadata?: Record<string, any>) => 
      analytics.trackQuestionReveal(quizId, questionId, metadata),
    trackFinish: (result: any, metadata?: Record<string, any>) => 
      analytics.trackQuizFinish(quizId, result, metadata),
    trackReview: (metadata?: Record<string, any>) => analytics.trackReviewOpen(quizId, metadata),
    trackCopy: (metadata?: Record<string, any>) => analytics.trackMDXCopy(quizId, metadata),
    trackSave: (metadata?: Record<string, any>) => analytics.trackAdminSave(quizId, metadata)
  };
}
