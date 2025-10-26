'use server';

import { revalidatePath } from 'next/cache';
import { ZQuizSubmission } from './schemas';
import { calculateQuizResult } from './scoring';
import { QuizResult } from './types';

// Mock Redis client - replace with actual Redis implementation
const mockRedis = {
  async set(key: string, value: any, options?: { ex?: number }) {
    // Mock implementation
    console.log(`Redis SET ${key}:`, value);
    return 'OK';
  },
  async get(key: string) {
    // Mock implementation
    console.log(`Redis GET ${key}`);
    return null;
  },
  async incr(key: string) {
    // Mock implementation
    console.log(`Redis INCR ${key}`);
    return 1;
  },
  async hincrby(key: string, field: string, increment: number) {
    // Mock implementation
    console.log(`Redis HINCRBY ${key} ${field} ${increment}`);
    return 1;
  }
};

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = `rate_limit:${ip}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}

function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function verifyNonce(nonce: string): boolean {
  // In production, implement proper nonce verification
  // This is a simplified version
  return nonce.length >= 10;
}

export async function submitQuizResult(
  submission: {
    quizId: string;
    version: string;
    answers: Record<string, string | string[]>;
    durationMs: number;
    variantId?: string;
    nonce: string;
  }
): Promise<{ success: boolean; result?: QuizResult; error?: string }> {
  try {
    // Validate submission
    const validatedSubmission = ZQuizSubmission.parse(submission);

    // Rate limiting (in production, use Redis)
    const clientIp = '127.0.0.1'; // In production, get from request headers
    if (!checkRateLimit(clientIp)) {
      return { success: false, error: 'Rate limit exceeded' };
    }

    // Verify nonce
    if (!verifyNonce(validatedSubmission.nonce)) {
      return { success: false, error: 'Invalid nonce' };
    }

    // Get quiz data (in production, fetch from database)
    const quizData = await getQuizData(validatedSubmission.quizId);
    if (!quizData) {
      return { success: false, error: 'Quiz not found' };
    }

    // Calculate result
    const result = calculateQuizResult(quizData.questions, validatedSubmission.answers, {
      enablePartialCredit: true,
      enableStreakBonus: true,
      enableTimeBonus: true
    });

    // Store result
    const resultId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await storeQuizResult(validatedSubmission.quizId, resultId, {
      ...validatedSubmission,
      result,
      timestamp: Date.now()
    });

    // Update analytics
    await updateQuizAnalytics(validatedSubmission.quizId, result);

    // Emit analytics events
    await emitAnalyticsEvent({
      type: 'quiz.finish',
      quizId: validatedSubmission.quizId,
      timestamp: Date.now(),
      metadata: {
        score: result.score,
        maxScore: result.maxScore,
        duration: validatedSubmission.durationMs,
        correctCount: result.correctCount,
        total: result.total
      }
    });

    return { success: true, result };

  } catch (error) {
    console.error('Error submitting quiz result:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function getQuizData(quizId: string): Promise<any> {
  // In production, fetch from database
  // This is a mock implementation
  return {
    id: quizId,
    questions: [
      {
        id: 'q1',
        type: 'single',
        prompt: 'What is 2 + 2?',
        choices: [
          { id: 'a', label: '3', isCorrect: false },
          { id: 'b', label: '4', isCorrect: true },
          { id: 'c', label: '5', isCorrect: false }
        ],
        points: 1
      }
    ]
  };
}

async function storeQuizResult(
  quizId: string, 
  resultId: string, 
  data: any
): Promise<void> {
  const key = `quiz:${quizId}:result:${resultId}`;
  await mockRedis.set(key, JSON.stringify(data), { ex: 86400 * 30 }); // 30 days
}

async function updateQuizAnalytics(quizId: string, result: QuizResult): Promise<void> {
  // Update attempt count
  await mockRedis.incr(`quiz:${quizId}:attempts`);
  
  // Update completion rate
  await mockRedis.hincrby(`quiz:${quizId}:stats`, 'completions', 1);
  
  // Update score histogram
  const scoreRange = Math.floor((result.score / result.maxScore) * 10) * 10;
  await mockRedis.hincrby(`quiz:${quizId}:histogram`, `${scoreRange}-${scoreRange + 9}`, 1);
  
  // Update per-question stats
  for (const questionResult of result.perQuestion) {
    const questionKey = `quiz:${quizId}:question:${questionResult.id}`;
    await mockRedis.hincrby(questionKey, 'attempts', 1);
    if (questionResult.correct) {
      await mockRedis.hincrby(questionKey, 'correct', 1);
    }
  }
}

async function emitAnalyticsEvent(event: {
  type: string;
  quizId: string;
  timestamp: number;
  metadata?: any;
}): Promise<void> {
  // In production, send to analytics service
  console.log('Analytics event:', event);
}

export async function getQuizStats(quizId: string): Promise<any> {
  try {
    // In production, fetch from Redis/database
    return {
      attempts: 0,
      completionRate: 0,
      avgTimePerQuestion: 0,
      perQuestionStats: [],
      scoreHistogram: [],
      streakDistribution: []
    };
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    return null;
  }
}

export async function generateQuizNonce(): Promise<string> {
  return generateNonce();
}
