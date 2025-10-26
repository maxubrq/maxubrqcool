/**
 * Quiz Scoring Logic
 * Handles all scoring calculations including partial credit and bonuses
 */

import { QuizQuestion, QuizResult, QuizChoice } from './types';

export interface ScoringOptions {
  enablePartialCredit?: boolean;
  enableStreakBonus?: boolean;
  enableTimeBonus?: boolean;
  streakBonusMultiplier?: number;
  timeBonusThreshold?: number; // seconds
}

export function calculateQuestionScore(
  question: QuizQuestion,
  userAnswer: string | string[],
  options: ScoringOptions = {}
): { earned: number; max: number; correct: boolean } {
  const maxPoints = question.points || 1;
  const { enablePartialCredit = true } = options;

  switch (question.type) {
    case 'single':
    case 'truefalse':
      const singleAnswer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
      const selectedChoice = question.choices?.find(c => c.id === singleAnswer);
      const isCorrect = selectedChoice?.isCorrect === true;
      return {
        earned: isCorrect ? maxPoints : 0,
        max: maxPoints,
        correct: isCorrect
      };

    case 'multiple':
      if (!Array.isArray(userAnswer)) {
        return { earned: 0, max: maxPoints, correct: false };
      }

      const correctChoices = question.choices?.filter(c => c.isCorrect) || [];
      const selectedChoices = question.choices?.filter(c => userAnswer.includes(c.id)) || [];
      
      const correctSelected = selectedChoices.filter(c => c.isCorrect);
      const incorrectSelected = selectedChoices.filter(c => !c.isCorrect);
      
      if (enablePartialCredit) {
        // Partial credit: (correct_selected - incorrect_selected) / total_correct
        const partialScore = Math.max(0, (correctSelected.length - incorrectSelected.length) / correctChoices.length);
        const earned = partialScore * maxPoints;
        return {
          earned,
          max: maxPoints,
          correct: correctSelected.length === correctChoices.length && incorrectSelected.length === 0
        };
      } else {
        // All-or-nothing scoring
        const isCorrect = correctSelected.length === correctChoices.length && incorrectSelected.length === 0;
        return {
          earned: isCorrect ? maxPoints : 0,
          max: maxPoints,
          correct: isCorrect
        };
      }

    case 'input':
      const inputAnswer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
      if (!inputAnswer || !question.answerPattern) {
        return { earned: 0, max: maxPoints, correct: false };
      }

      // Case-insensitive regex matching
      const pattern = new RegExp(question.answerPattern, 'i');
      const isCorrect = pattern.test(inputAnswer.trim());
      
      return {
        earned: isCorrect ? maxPoints : 0,
        max: maxPoints,
        correct: isCorrect
      };

    default:
      return { earned: 0, max: maxPoints, correct: false };
  }
}

export function calculateQuizResult(
  questions: QuizQuestion[],
  answers: Record<string, string | string[]>,
  options: ScoringOptions = {}
): QuizResult {
  const perQuestion = questions.map(question => {
    const userAnswer = answers[question.id];
    const score = calculateQuestionScore(question, userAnswer, options);
    return {
      id: question.id,
      correct: score.correct,
      earned: score.earned,
      max: score.max
    };
  });

  const correctCount = perQuestion.filter(q => q.correct).length;
  const total = questions.length;
  const score = perQuestion.reduce((sum, q) => sum + q.earned, 0);
  const maxScore = perQuestion.reduce((sum, q) => sum + q.max, 0);

  return {
    correctCount,
    total,
    score,
    maxScore,
    perQuestion
  };
}

export function applyStreakBonus(
  result: QuizResult,
  streak: number,
  multiplier: number = 0.1
): QuizResult {
  if (streak <= 1) return result;

  const bonus = Math.min(streak * multiplier, 0.5); // Cap at 50% bonus
  const bonusPoints = result.score * bonus;

  return {
    ...result,
    score: result.score + bonusPoints,
    maxScore: result.maxScore + bonusPoints
  };
}

export function applyTimeBonus(
  result: QuizResult,
  timeUsed: number, // seconds
  timeLimit: number,
  threshold: number = 0.8 // 80% of time limit
): QuizResult {
  if (timeUsed >= timeLimit * threshold) return result;

  const timeBonus = (timeLimit * threshold - timeUsed) / (timeLimit * threshold) * 0.1; // Up to 10% bonus
  const bonusPoints = result.score * timeBonus;

  return {
    ...result,
    score: result.score + bonusPoints,
    maxScore: result.maxScore + bonusPoints
  };
}

export function shuffleQuestions(questions: QuizQuestion[], seed?: string): QuizQuestion[] {
  if (!seed) {
    return [...questions].sort(() => Math.random() - 0.5);
  }

  // Deterministic shuffle using seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.abs(hash) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    hash = (hash * 1664525 + 1013904223) % 4294967296; // Linear congruential generator
  }

  return shuffled;
}
