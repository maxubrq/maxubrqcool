'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, Play, Pause } from 'lucide-react'
import { encryptAnswerAdvanced, decryptAnswerAdvanced } from '@/lib/quiz/encryption'

// Sample quiz data - this would normally come from props or a data source
const sampleQuestions = [
  {
    id: "js-1",
    question: "What is the correct way to declare a variable in JavaScript?",
    type: "single-choice" as const,
    options: [
      "var myVar = 'hello';",
      "variable myVar = 'hello';",
      "v myVar = 'hello';",
      "declare myVar = 'hello';"
    ],
    correctAnswer: "var myVar = 'hello';",
    explanation: "The 'var' keyword is used to declare variables in JavaScript.",
    points: 10,
    difficulty: "easy" as const,
    tags: ["variables", "declaration"]
  },
  {
    id: "js-2",
    question: "Which of the following are valid JavaScript data types?",
    type: "multiple-choice" as const,
    options: [
      "String",
      "Number",
      "Boolean",
      "Array",
      "Object",
      "Null",
      "Undefined"
    ],
    correctAnswer: ["String", "Number", "Boolean", "Object", "Null", "Undefined"],
    explanation: "All of these are valid JavaScript data types. Array is actually a type of Object.",
    points: 15,
    difficulty: "medium" as const,
    tags: ["data-types", "fundamentals"]
  },
  {
    id: "js-3",
    question: "What will be the output of the following code?",
    type: "single-choice" as const,
    options: [
      "undefined",
      "ReferenceError",
      "Hello World",
      "null"
    ],
    correctAnswer: "Hello World",
    explanation: "The function is hoisted, so it can be called before its declaration.",
    points: 20,
    difficulty: "hard" as const,
    tags: ["hoisting", "functions"]
  },
  {
    id: "js-4",
    question: "Write a function that takes two numbers and returns their sum.",
    type: "code" as const,
    correctAnswer: "function add(a, b) { return a + b; }",
    explanation: "A simple function that takes two parameters and returns their sum.",
    points: 25,
    difficulty: "easy" as const,
    tags: ["functions", "parameters", "return"]
  },
  {
    id: "js-5",
    question: "Explain the difference between == and === in JavaScript.",
    type: "text" as const,
    correctAnswer: "== performs type coercion while === performs strict equality comparison",
    explanation: "== converts operands to the same type before comparison, while === compares both value and type.",
    points: 30,
    difficulty: "medium" as const,
    tags: ["operators", "comparison", "type-coercion"]
  }
]

// Encrypt the answers
const encryptedQuestions = sampleQuestions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function QuizDemo() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(10 * 60) // 10 minutes
  const [showResults, setShowResults] = useState(false)
  const [result, setResult] = useState<any>(null)

  const currentQuestion = encryptedQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / encryptedQuestions.length) * 100

  const handleAnswerChange = useCallback((questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }, [])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < encryptedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }, [currentQuestionIndex])

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }, [currentQuestionIndex])

  const handleSubmit = useCallback(() => {
    let correctAnswers = 0
    const resultAnswers: any[] = []

    encryptedQuestions.forEach((question) => {
      const userAnswer = answers[question.id]
      const correctAnswer = decryptAnswerAdvanced(question.correctAnswer, question.id)
      
      let isCorrect = false
      if (question.type === 'multiple-choice') {
        const correctAnswersArray = Array.isArray(correctAnswer) ? correctAnswer : correctAnswer.split('|')
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

    const percentage = Math.round((correctAnswers / encryptedQuestions.length) * 100)
    
    const quizResult = {
      score: correctAnswers,
      totalQuestions: encryptedQuestions.length,
      correctAnswers,
      percentage,
      isPassed: percentage >= 70,
      timeSpent: 0,
      answers: resultAnswers
    }
    
    setResult(quizResult)
    setIsSubmitted(true)
    setShowResults(true)
  }, [answers])

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setIsSubmitted(false)
    setTimeRemaining(10 * 60)
    setShowResults(false)
    setResult(null)
    setIsPaused(false)
  }, [])

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
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-blue-700">Time Remaining</div>
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
    >
      <Card className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold">JavaScript Fundamentals Quiz</CardTitle>
              <CardDescription className="text-base mt-2">Test your knowledge of JavaScript basics</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {encryptedQuestions.length}</span>
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
              {currentQuestionIndex === encryptedQuestions.length - 1 ? (
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
  question: any
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

      {/* Answer Options */}
      <div className="space-y-3">
        {question.type === 'single-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option: string, index: number) => (
              <motion.label
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 transition-all focus-within:ring-2 focus-within:ring-primary/40 ${
                  value === option
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5 dark:border-gray-700 dark:hover:border-primary/50 dark:hover:bg-primary/10'
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
            {question.options.map((option: string, index: number) => (
              <motion.label
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border-2 transition-all focus-within:ring-2 focus-within:ring-primary/40 ${
                  Array.isArray(value) && value.includes(option)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5 dark:border-gray-700 dark:hover:border-primary/50 dark:hover:bg-primary/10'
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
