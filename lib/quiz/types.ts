/**
 * Quiz System Types
 * Production-ready TypeScript definitions for the Next.js Quiz component system
 */

export type QuizChoice = {
  id: string;
  label: string;
  isCorrect?: boolean;
  hint?: string;
};

export type QuizQuestion = {
  id: string;
  type: 'single' | 'multiple' | 'truefalse' | 'input';
  prompt: string;
  choices?: QuizChoice[];
  answerPattern?: string; // For input type questions
  explanation?: string;
  points?: number;
};

export type QuizModel = {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  shuffle?: boolean;
  timeLimitSec?: number;
  version?: string;
};

export type QuizResult = {
  correctCount: number;
  total: number;
  score: number;
  maxScore: number;
  perQuestion: Array<{
    id: string;
    correct: boolean;
    earned: number;
    max: number;
  }>;
};

export type QuizState = {
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  reveals: Record<string, boolean>;
  startTime: number;
  endTime?: number;
  streak: number;
  isComplete: boolean;
};

export type QuizMode = 'practice' | 'exam';

export type QuizAnalyticsEvent = {
  type: 'quiz.view' | 'quiz.start' | 'quiz.select_choice' | 'quiz.reveal_question' | 'quiz.finish' | 'quiz.review_open' | 'quiz.copy_mdx' | 'quiz.admin.save';
  quizId: string;
  questionId?: string;
  choiceId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
};

export type QuizSubmission = {
  quizId: string;
  version: string;
  answers: Record<string, string | string[]>;
  durationMs: number;
  variantId?: string;
  nonce: string;
};

export type QuizStats = {
  attempts: number;
  completionRate: number;
  avgTimePerQuestion: number;
  perQuestionStats: Array<{
    questionId: string;
    correctRate: number;
    avgTime: number;
    mostMissedChoice?: string;
  }>;
  scoreHistogram: Array<{
    scoreRange: string;
    count: number;
  }>;
  streakDistribution: Array<{
    streak: number;
    count: number;
  }>;
};
