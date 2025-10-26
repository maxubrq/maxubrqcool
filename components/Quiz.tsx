'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, Play, Pause } from 'lucide-react'
import { QuizConfig, QuizState, QuizResult, QuizQuestion } from '@/lib/quiz/types'
import { calculateScore, formatTime, getDifficultyColor, getDifficultyIcon, shuffleArray } from '@/lib/quiz/utils'

interface QuizProps {
  config: QuizConfig
  onComplete?: (result: QuizResult) => void
  onQuestionChange?: (questionIndex: number) => void
  className?: string
}

export function Quiz({ config, onComplete, onQuestionChange, className }: QuizProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isSubmitted: false,
    timeRemaining: config.timeLimit ? config.timeLimit * 60 : undefined
  })

  const [isPaused, setIsPaused] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  const handleAnswerChange = useCallback((questionId: string, answer: string | string[]) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }))
  }, [])

  const handleNext = useCallback(() => {
    if (state.currentQuestionIndex < config.questions.length - 1) {
      const nextIndex = state.currentQuestionIndex + 1
      setState(prev => ({ ...prev, currentQuestionIndex: nextIndex }))
      onQuestionChange?.(nextIndex)
    }
  }, [state.currentQuestionIndex, config.questions.length, onQuestionChange])

  const handlePrevious = useCallback(() => {
    if (state.currentQuestionIndex > 0) {
      const prevIndex = state.currentQuestionIndex - 1
      setState(prev => ({ ...prev, currentQuestionIndex: prevIndex }))
      onQuestionChange?.(prevIndex)
    }
  }, [state.currentQuestionIndex, onQuestionChange])

  const handleSubmit = useCallback(() => {
    const quizResult = calculateScore(config.questions, state.answers)
    setResult(quizResult)
    setState(prev => ({ ...prev, isSubmitted: true }))
    setShowResults(true)
    onComplete?.(quizResult)
  }, [config.questions, state.answers, onComplete])

  const handleRestart = useCallback(() => {
    setState({
      currentQuestionIndex: 0,
      answers: {},
      isSubmitted: false,
      timeRemaining: config.timeLimit ? config.timeLimit * 60 : undefined
    })
    setShowResults(false)
    setResult(null)
    setIsPaused(false)
  }, [config.timeLimit])

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  // Timer effect
  useEffect(() => {
    if (!state.timeRemaining || state.isSubmitted || isPaused) return

    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        timeRemaining: prev.timeRemaining! - 1
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [state.timeRemaining, state.isSubmitted, isPaused])

  // Auto-submit when time runs out
  useEffect(() => {
    if (state.timeRemaining === 0 && !state.isSubmitted) {
      handleSubmit()
    }
  }, [state.timeRemaining, state.isSubmitted, handleSubmit])

  const currentQuestion = config.questions[state.currentQuestionIndex]
  const progress = ((state.currentQuestionIndex + 1) / config.questions.length) * 100

  // Show loading state if no questions or current question is undefined
  if (!config.questions.length || !currentQuestion) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (showResults && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">
              Quiz Complete!
            </CardTitle>
            <CardDescription className="text-lg">
              You scored {result.correctAnswers} out of {result.totalQuestions} questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-primary mb-2">
                {result.percentage}%
              </div>
              <Badge 
                variant={result.isPassed ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {result.isPassed ? "Passed" : "Failed"}
              </Badge>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Progress value={result.percentage} className="w-full h-3" />
            </motion.div>

            {/* Results Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                <div className="text-sm text-green-700">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{result.totalQuestions - result.correctAnswers}</div>
                <div className="text-sm text-red-700">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{formatTime(Math.floor(result.timeSpent / 1000))}</div>
                <div className="text-sm text-blue-700">Time Spent</div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center"
            >
              <Button onClick={handleRestart} variant="outline" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              {config.allowRetake && (
                <Button onClick={() => setShowResults(false)} size="lg">
                  Review Answers
                </Button>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
              {config.description && (
                <CardDescription className="text-base mt-2">{config.description}</CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              {state.timeRemaining !== undefined && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(state.timeRemaining)}
                </Badge>
              )}
              {state.timeRemaining !== undefined && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePause}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {state.currentQuestionIndex + 1} of {config.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionRenderer
                question={currentQuestion}
                value={state.answers[currentQuestion.id]}
                onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
              />
            </motion.div>
          </AnimatePresence>

          <Separator className="my-6" />

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={state.currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {state.currentQuestionIndex === config.questions.length - 1 ? (
                <Button onClick={handleSubmit} size="lg">
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext} size="lg">
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Question Renderer Component
interface QuestionRendererProps {
  question: QuizQuestion
  value: string | string[] | undefined
  onChange: (answer: string | string[]) => void
}

function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  const handleSingleChoice = (option: string) => {
    onChange(option)
  }

  const handleMultipleChoice = (option: string, checked: boolean) => {
    const currentAnswers = Array.isArray(value) ? value : []
    if (checked) {
      onChange([...currentAnswers, option])
    } else {
      onChange(currentAnswers.filter(answer => answer !== option))
    }
  }

  const handleTextAnswer = (text: string) => {
    onChange(text)
  }

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Question</Badge>
          {question.difficulty && (
            <Badge className={getDifficultyColor(question.difficulty)}>
              {getDifficultyIcon(question.difficulty)} {question.difficulty}
            </Badge>
          )}
          {question.points && (
            <Badge variant="outline">{question.points} points</Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold">{question.question}</h3>
      </div>

      {/* Question Content - This is where MDX content would be rendered */}
      <div className="prose max-w-none">
        {/* This div will contain the MDX content passed as children */}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.type === 'single-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <motion.label
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  value === option
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={() => handleSingleChoice(option)}
                  className="h-4 w-4 text-primary"
                />
                <span className="flex-1 text-base">{option}</span>
              </motion.label>
            ))}
          </div>
        )}

        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <motion.label
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  Array.isArray(value) && value.includes(option)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  name={`question-${question.id}`}
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => handleMultipleChoice(option, e.target.checked)}
                  className="h-4 w-4 text-primary"
                />
                <span className="flex-1 text-base">{option}</span>
              </motion.label>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <div className="space-y-2">
            <textarea
              value={value as string || ''}
              onChange={(e) => handleTextAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
            />
          </div>
        )}

        {question.type === 'code' && (
          <div className="space-y-2">
            <textarea
              value={value as string || ''}
              onChange={(e) => handleTextAnswer(e.target.value)}
              placeholder="Enter your code here..."
              className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={8}
            />
          </div>
        )}
      </div>
    </div>
  )
}
