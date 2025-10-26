'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Clock, Trophy, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QuizModel, QuizState, QuizResult, QuizMode } from '@/lib/quiz/types';
import { calculateQuizResult, applyStreakBonus, applyTimeBonus } from '@/lib/quiz/scoring';
import { cn } from '@/lib/utils';

interface QuizPlayerProps {
  quiz: QuizModel;
  mode?: QuizMode;
  onComplete?: (result: QuizResult) => void;
  onAnalytics?: (event: string, data?: any) => void;
  className?: string;
}

export function QuizPlayer({ 
  quiz, 
  mode = 'practice', 
  onComplete, 
  onAnalytics,
  className 
}: QuizPlayerProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    reveals: {},
    startTime: Date.now(),
    streak: 0,
    isComplete: false
  });

  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.timeLimitSec || null
  );

  const [showReview, setShowReview] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Timer effect
  useEffect(() => {
    if (timeRemaining === null || state.isComplete) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining, state.isComplete]);

  // Analytics tracking
  useEffect(() => {
    onAnalytics?.('quiz.view', { quizId: quiz.id });
  }, [quiz.id, onAnalytics]);

  const currentQuestion = quiz.questions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = useCallback((questionId: string, answer: string | string[]) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));

    onAnalytics?.('quiz.select_choice', { 
      quizId: quiz.id, 
      questionId, 
      choiceId: Array.isArray(answer) ? answer[0] : answer 
    });
  }, [quiz.id, onAnalytics]);

  const handleReveal = useCallback((questionId: string) => {
    setState(prev => ({
      ...prev,
      reveals: { ...prev.reveals, [questionId]: true }
    }));

    onAnalytics?.('quiz.reveal_question', { quizId: quiz.id, questionId });
  }, [quiz.id, onAnalytics]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      handleQuizComplete();
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  }, [isLastQuestion]);

  const handleQuizComplete = useCallback(() => {
    const endTime = Date.now();
    const duration = endTime - state.startTime;
    
    setState(prev => ({ ...prev, isComplete: true, endTime }));
    
    // Calculate result
    const baseResult = calculateQuizResult(quiz.questions, state.answers, {
      enablePartialCredit: true,
      enableStreakBonus: mode === 'exam',
      enableTimeBonus: mode === 'exam' && quiz.timeLimitSec
    });

    let finalResult = baseResult;
    
    if (mode === 'exam' && state.streak > 1) {
      finalResult = applyStreakBonus(finalResult, state.streak);
    }
    
    if (mode === 'exam' && quiz.timeLimitSec && timeRemaining !== null) {
      const timeUsed = quiz.timeLimitSec - timeRemaining;
      finalResult = applyTimeBonus(finalResult, timeUsed, quiz.timeLimitSec);
    }

    setResult(finalResult);
    onComplete?.(finalResult);
    onAnalytics?.('quiz.finish', { 
      quizId: quiz.id, 
      score: finalResult.score, 
      maxScore: finalResult.maxScore,
      duration 
    });
  }, [quiz, state, mode, timeRemaining, onComplete, onAnalytics]);

  const handleRestart = useCallback(() => {
    setState({
      currentQuestionIndex: 0,
      answers: {},
      reveals: {},
      startTime: Date.now(),
      streak: 0,
      isComplete: false
    });
    setTimeRemaining(quiz.timeLimitSec || null);
    setResult(null);
    setShowReview(false);
  }, [quiz.timeLimitSec]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (state.isComplete && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("space-y-6", className)}
      >
        <Card className="bg-gradient-to-b from-background to-muted/20 border-0 shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {result.score.toFixed(1)} / {result.maxScore}
              </div>
              <div className="text-lg text-muted-foreground">
                {result.correctCount} of {result.total} correct
              </div>
              <div className="text-sm text-muted-foreground">
                {((result.score / result.maxScore) * 100).toFixed(1)}% accuracy
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRestart} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button onClick={() => setShowReview(!showReview)} variant="outline">
                {showReview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showReview ? 'Hide' : 'Show'} Review
              </Button>
            </div>

            <AnimatePresence>
              {showReview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold">Question Review</h3>
                    {quiz.questions.map((question, index) => {
                      const questionResult = result.perQuestion.find(q => q.id === question.id);
                      const userAnswer = state.answers[question.id];
                      const isRevealed = state.reveals[question.id];

                      return (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg border bg-card"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Question {index + 1}</span>
                            <Badge variant={questionResult?.correct ? "default" : "destructive"}>
                              {questionResult?.earned.toFixed(1)} / {questionResult?.max}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{question.prompt}</p>
                          
                          {question.explanation && (
                            <div className="text-sm bg-muted/50 p-3 rounded-md">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn("space-y-6", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          {quiz.description && (
            <p className="text-sm text-muted-foreground">{quiz.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {state.streak > 1 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              🔥 {state.streak} streak
            </Badge>
          )}
          {timeRemaining !== null && (
            <Badge 
              variant={timeRemaining <= 15 ? "destructive" : "secondary"}
              className="flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              {formatTime(timeRemaining)}
            </Badge>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {state.currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>{Math.round(((state.currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</span>
        </div>
        <Progress 
          value={((state.currentQuestionIndex + 1) / quiz.questions.length) * 100} 
          className="h-2"
        />
      </div>

      {/* Question */}
      <Card className="bg-gradient-to-b from-background to-muted/20 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.prompt}</CardTitle>
          {currentQuestion.points && currentQuestion.points > 1 && (
            <Badge variant="outline">{currentQuestion.points} points</Badge>
          )}
        </CardHeader>
        <CardContent>
          <QuestionRenderer
            question={currentQuestion}
            userAnswer={state.answers[currentQuestion.id]}
            isRevealed={state.reveals[currentQuestion.id]}
            onAnswerSelect={(answer) => handleAnswerSelect(currentQuestion.id, answer)}
            onReveal={() => handleReveal(currentQuestion.id)}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setState(prev => ({ 
            ...prev, 
            currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1) 
          }))}
          disabled={state.currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </motion.div>
  );
}

// Question Renderer Component
interface QuestionRendererProps {
  question: QuizModel['questions'][0];
  userAnswer?: string | string[];
  isRevealed?: boolean;
  onAnswerSelect: (answer: string | string[]) => void;
  onReveal: () => void;
}

function QuestionRenderer({ 
  question, 
  userAnswer, 
  isRevealed, 
  onAnswerSelect, 
  onReveal 
}: QuestionRendererProps) {
  const handleChoiceClick = (choiceId: string) => {
    if (question.type === 'multiple') {
      const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
      const newAnswers = currentAnswers.includes(choiceId)
        ? currentAnswers.filter(id => id !== choiceId)
        : [...currentAnswers, choiceId];
      onAnswerSelect(newAnswers);
    } else {
      onAnswerSelect(choiceId);
    }
  };

  const isChoiceSelected = (choiceId: string) => {
    if (question.type === 'multiple') {
      return Array.isArray(userAnswer) && userAnswer.includes(choiceId);
    }
    return userAnswer === choiceId;
  };

  const isChoiceCorrect = (choice: any) => choice.isCorrect === true;
  const isChoiceIncorrect = (choice: any) => choice.isCorrect === false;

  return (
    <div className="space-y-4">
      {question.type === 'input' ? (
        <div className="space-y-2">
          <input
            type="text"
            value={userAnswer as string || ''}
            onChange={(e) => onAnswerSelect(e.target.value)}
            placeholder="Type your answer..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {question.answerPattern && (
            <p className="text-xs text-muted-foreground">
              Expected format: {question.answerPattern}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {question.choices?.map((choice, index) => {
            const isSelected = isChoiceSelected(choice.id);
            const isCorrect = isChoiceCorrect(choice);
            const isIncorrect = isChoiceIncorrect(choice);
            const showResult = isRevealed && (isCorrect || isIncorrect);

            return (
              <motion.button
                key={choice.id}
                onClick={() => handleChoiceClick(choice.id)}
                disabled={isRevealed}
                className={cn(
                  "w-full p-4 text-left rounded-lg border transition-all duration-200",
                  "hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary",
                  isSelected && "ring-2 ring-primary bg-primary/10",
                  showResult && isCorrect && "bg-green-100 border-green-500 text-green-800",
                  showResult && isIncorrect && "bg-red-100 border-red-500 text-red-800",
                  isRevealed && !isSelected && isCorrect && "bg-green-50 border-green-300"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={showResult && isCorrect ? { 
                  scale: [1, 1.03, 1],
                  transition: { duration: 0.6, repeat: 1 }
                } : showResult && isIncorrect ? {
                  x: [-4, 4, -4, 4, 0],
                  transition: { duration: 0.4 }
                } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{choice.label}</span>
                    {choice.hint && !isRevealed && (
                      <Badge variant="outline" className="text-xs">
                        Hint
                      </Badge>
                    )}
                  </div>
                  {showResult && (
                    <div className="flex items-center gap-2">
                      {isCorrect && <Check className="w-4 h-4 text-green-600" />}
                      {isIncorrect && <X className="w-4 h-4 text-red-600" />}
                    </div>
                  )}
                </div>
                {choice.hint && isRevealed && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Hint:</strong> {choice.hint}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {!isRevealed && (
        <Button 
          variant="outline" 
          onClick={onReveal}
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          Reveal Answer
        </Button>
      )}

      {isRevealed && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-muted/50 rounded-lg"
        >
          <h4 className="font-semibold mb-2">Explanation:</h4>
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
