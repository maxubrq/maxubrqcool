/**
 * Quiz System Zod Schemas
 * Validation schemas for all quiz-related data structures
 */

import { z } from 'zod';

export const ZQuizChoice = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  isCorrect: z.boolean().optional(),
  hint: z.string().optional(),
});

export const ZQuizQuestion = z.object({
  id: z.string().min(1),
  type: z.enum(['single', 'multiple', 'truefalse', 'input']),
  prompt: z.string().min(1),
  choices: z.array(ZQuizChoice).optional(),
  answerPattern: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().positive().optional().default(1),
}).refine((data) => {
  // Validate that choices are provided for non-input types
  if (data.type !== 'input' && (!data.choices || data.choices.length === 0)) {
    return false;
  }
  // Validate that answerPattern is provided for input type
  if (data.type === 'input' && !data.answerPattern) {
    return false;
  }
  return true;
}, {
  message: "Invalid question configuration: choices required for non-input types, answerPattern required for input type"
});

export const ZQuizModel = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  questions: z.array(ZQuizQuestion).min(1),
  shuffle: z.boolean().optional().default(false),
  timeLimitSec: z.number().positive().optional(),
  version: z.string().optional().default('1.0.0'),
});

export const ZQuizResult = z.object({
  correctCount: z.number().nonnegative(),
  total: z.number().positive(),
  score: z.number().nonnegative(),
  maxScore: z.number().positive(),
  perQuestion: z.array(z.object({
    id: z.string(),
    correct: z.boolean(),
    earned: z.number().nonnegative(),
    max: z.number().positive(),
  })),
});

export const ZQuizSubmission = z.object({
  quizId: z.string().min(1),
  version: z.string().min(1),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  durationMs: z.number().nonnegative(),
  variantId: z.string().optional(),
  nonce: z.string().min(1),
});

export const ZQuizAnalyticsEvent = z.object({
  type: z.enum(['quiz.view', 'quiz.start', 'quiz.select_choice', 'quiz.reveal_question', 'quiz.finish', 'quiz.review_open', 'quiz.copy_mdx', 'quiz.admin.save']),
  quizId: z.string().min(1),
  questionId: z.string().optional(),
  choiceId: z.string().optional(),
  timestamp: z.number().positive(),
  metadata: z.record(z.any()).optional(),
});

export const ZQuizStats = z.object({
  attempts: z.number().nonnegative(),
  completionRate: z.number().min(0).max(1),
  avgTimePerQuestion: z.number().nonnegative(),
  perQuestionStats: z.array(z.object({
    questionId: z.string(),
    correctRate: z.number().min(0).max(1),
    avgTime: z.number().nonnegative(),
    mostMissedChoice: z.string().optional(),
  })),
  scoreHistogram: z.array(z.object({
    scoreRange: z.string(),
    count: z.number().nonnegative(),
  })),
  streakDistribution: z.array(z.object({
    streak: z.number().nonnegative(),
    count: z.number().nonnegative(),
  })),
});

// Type exports for use in components
export type QuizChoice = z.infer<typeof ZQuizChoice>;
export type QuizQuestion = z.infer<typeof ZQuizQuestion>;
export type QuizModel = z.infer<typeof ZQuizModel>;
export type QuizResult = z.infer<typeof ZQuizResult>;
export type QuizSubmission = z.infer<typeof ZQuizSubmission>;
export type QuizAnalyticsEvent = z.infer<typeof ZQuizAnalyticsEvent>;
export type QuizStats = z.infer<typeof ZQuizStats>;
