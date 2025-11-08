'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, Play, Pause } from 'lucide-react'
import { encryptAnswerAdvanced, decryptAnswerAdvanced } from '@/lib/quiz/encryption'

interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'single-choice' | 'text' | 'code'
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
}

interface SimpleQuizProps {
  title: string
  description?: string
  timeLimit?: number
  passingScore?: number
  allowRetake?: boolean
  showCorrectAnswers?: boolean
  questions: QuizQuestion[]
}

export function SimpleQuiz({
  title,
  description,
  timeLimit,
  passingScore = 70,
  allowRetake = true,
  showCorrectAnswers = true,
  questions
}: SimpleQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : undefined)
  const [showResults, setShowResults] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Safely handle questions array - wrapped in useMemo to prevent re-creation on every render
  const safeQuestions = useMemo(() => {
    return (questions && Array.isArray(questions)) ? questions : []
  }, [questions])

  const currentQuestion = safeQuestions[currentQuestionIndex]
  const progress = safeQuestions.length > 0 ? ((currentQuestionIndex + 1) / safeQuestions.length) * 100 : 0

  const handleAnswerChange = useCallback((questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }, [])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < safeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }, [currentQuestionIndex, safeQuestions.length])

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }, [currentQuestionIndex])

  const handleSubmit = useCallback(() => {
    let correctAnswers = 0
    const resultAnswers: any[] = []

    safeQuestions.forEach((question) => {
      const userAnswer = answers[question.id]
      const correctAnswer = decryptAnswerAdvanced(question.correctAnswer as string, question.id)
      
      let isCorrect = false
      if (question.type === 'multiple-choice') {
        const correctAnswersArray = correctAnswer.split('|')
        const userAnswersArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
        isCorrect = correctAnswersArray.length === userAnswersArray.length &&
          correctAnswersArray.every(answer => userAnswersArray.includes(answer))
      } else {
        isCorrect = userAnswer === correctAnswer
      }

      if (isCorrect) {
        correctAnswers++
      }

      resultAnswers.push({
        questionId: question.id,
        userAnswer: userAnswer || '',
        correctAnswer: correctAnswer,
        isCorrect,
        explanation: question.explanation
      })
    })

    const percentage = safeQuestions.length > 0 ? Math.round((correctAnswers / safeQuestions.length) * 100) : 0
    
    const quizResult = {
      score: correctAnswers,
      totalQuestions: safeQuestions.length,
      correctAnswers,
      percentage,
      isPassed: percentage >= passingScore,
      timeSpent: 0,
      answers: resultAnswers
    }
    
    setResult(quizResult)
    setIsSubmitted(true)
    setShowResults(true)
  }, [answers, safeQuestions, passingScore])

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsSubmitted(false)
    setTimeRemaining(timeLimit ? timeLimit * 60 : undefined)
    setShowResults(false)
    setIsReviewMode(false)
    setResult(null)
    setIsPaused(false)
  }, [timeLimit])

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  if (showResults && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
                <div className="text-2xl font-bold text-blue-600">0:00</div>
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
              {allowRetake && showCorrectAnswers && (
                <Button onClick={() => {
                  setShowResults(false)
                  setIsReviewMode(true)
                }} size="lg">
                  Review Answers
                </Button>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Early return if no questions or invalid current question
  if (!safeQuestions || safeQuestions.length === 0 || !currentQuestion) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center text-muted-foreground">
        <p>No questions available for this quiz.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              {description && (
                <CardDescription className="text-base mt-2">{description}</CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              {timeRemaining !== undefined && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </Badge>
              )}
              {timeRemaining !== undefined && (
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
              <span>Question {currentQuestionIndex + 1} of {safeQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionRenderer
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                isReviewMode={isReviewMode}
                resultData={result?.answers?.find((a: any) => a.questionId === currentQuestion.id)}
              />
            </motion.div>
          </AnimatePresence>

          <Separator className="my-6" />

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestionIndex === safeQuestions.length - 1 ? (
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
  isReviewMode?: boolean
  resultData?: {
    userAnswer: string | string[]
    correctAnswer: string | string[]
    isCorrect: boolean
    explanation?: string
  }
}

function QuestionRenderer({ question, value, onChange, isReviewMode = false, resultData }: QuestionRendererProps) {
  const handleSingleChoice = (option: string) => {
    if (!isReviewMode) {
      onChange(option)
    }
  }

  const handleMultipleChoice = (option: string, checked: boolean) => {
    if (!isReviewMode) {
      const currentAnswers = Array.isArray(value) ? value : []
      if (checked) {
        onChange([...currentAnswers, option])
      } else {
        onChange(currentAnswers.filter(answer => answer !== option))
      }
    }
  }

  const handleTextAnswer = (text: string) => {
    if (!isReviewMode) {
      onChange(text)
    }
  }

  // Helper to check if an option is correct
  const isCorrectOption = (option: string): boolean => {
    if (!isReviewMode || !resultData) return false
    const correctAnswer = resultData.correctAnswer
    if (question.type === 'multiple-choice') {
      const correctArray = Array.isArray(correctAnswer) ? correctAnswer : (typeof correctAnswer === 'string' ? correctAnswer.split('|') : [])
      return correctArray.includes(option)
    } else {
      return correctAnswer === option
    }
  }

  // Helper to check if an option was selected by user
  const isUserSelected = (option: string): boolean => {
    if (question.type === 'multiple-choice') {
      return Array.isArray(value) && value.includes(option)
    } else {
      return value === option
    }
  }

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Question</Badge>
          {question.difficulty && (
            <Badge className={`text-sm px-2 py-1 ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {question.difficulty}
            </Badge>
          )}
          {question.points && (
            <Badge variant="outline">{question.points} points</Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold">{question.question}</h3>
      </div>

      {/* Explanation in review mode */}
      {isReviewMode && resultData?.explanation && (
        <div className={`p-4 rounded-lg border-2 ${
          resultData.isCorrect 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            {resultData.isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`font-semibold mb-1 ${
                resultData.isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {resultData.isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-sm text-gray-700">{resultData.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-3">
        {question.type === 'single-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isCorrect = isCorrectOption(option)
              const isSelected = isUserSelected(option)
              const showAsCorrect = isReviewMode && isCorrect
              const showAsIncorrect = isReviewMode && isSelected && !isCorrect
              
              return (
                <motion.label
                  key={index}
                  whileHover={!isReviewMode ? { scale: 1.02 } : {}}
                  whileTap={!isReviewMode ? { scale: 0.98 } : {}}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    isReviewMode 
                      ? 'cursor-default' 
                      : 'cursor-pointer'
                  } ${
                    showAsCorrect
                      ? 'border-green-500 bg-green-50'
                      : showAsIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={() => handleSingleChoice(option)}
                      disabled={isReviewMode}
                      className="h-4 w-4 text-primary"
                    />
                    {isReviewMode && isCorrect && (
                      <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-600 bg-white rounded-full" />
                    )}
                    {isReviewMode && isSelected && !isCorrect && (
                      <XCircle className="absolute -top-1 -right-1 w-5 h-5 text-red-600 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="flex-1 text-base">{option}</span>
                  {isReviewMode && isCorrect && (
                    <Badge className="bg-green-600 text-white">Correct Answer</Badge>
                  )}
                </motion.label>
              )
            })}
          </div>
        )}

        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isCorrect = isCorrectOption(option)
              const isSelected = isUserSelected(option)
              const showAsCorrect = isReviewMode && isCorrect
              const showAsIncorrect = isReviewMode && isSelected && !isCorrect
              
              return (
                <motion.label
                  key={index}
                  whileHover={!isReviewMode ? { scale: 1.02 } : {}}
                  whileTap={!isReviewMode ? { scale: 0.98 } : {}}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    isReviewMode 
                      ? 'cursor-default' 
                      : 'cursor-pointer'
                  } ${
                    showAsCorrect
                      ? 'border-green-500 bg-green-50'
                      : showAsIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      name={`question-${question.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={(e) => handleMultipleChoice(option, e.target.checked)}
                      disabled={isReviewMode}
                      className="h-4 w-4 text-primary"
                    />
                    {isReviewMode && isCorrect && (
                      <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-600 bg-white rounded-full" />
                    )}
                    {isReviewMode && isSelected && !isCorrect && (
                      <XCircle className="absolute -top-1 -right-1 w-5 h-5 text-red-600 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="flex-1 text-base">{option}</span>
                  {isReviewMode && isCorrect && (
                    <Badge className="bg-green-600 text-white">Correct</Badge>
                  )}
                </motion.label>
              )
            })}
          </div>
        )}

        {question.type === 'text' && (
          <div className="space-y-2">
            <textarea
              value={value as string || ''}
              onChange={(e) => handleTextAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              disabled={isReviewMode}
              className={`w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                isReviewMode 
                  ? resultData?.isCorrect 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              rows={4}
            />
            {isReviewMode && resultData && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-1">Correct Answer:</p>
                <p className="text-sm text-blue-700">{resultData.correctAnswer}</p>
              </div>
            )}
          </div>
        )}

        {question.type === 'code' && (
          <div className="space-y-2">
            <textarea
              value={value as string || ''}
              onChange={(e) => handleTextAnswer(e.target.value)}
              placeholder="Enter your code here..."
              disabled={isReviewMode}
              className={`w-full p-4 border rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                isReviewMode 
                  ? resultData?.isCorrect 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              rows={8}
            />
            {isReviewMode && resultData && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-1">Correct Answer:</p>
                <pre className="text-sm text-blue-700 whitespace-pre-wrap font-mono">{resultData.correctAnswer}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
