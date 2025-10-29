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

// React Quiz Data
const reactQuestions = [
  {
    id: "react-1",
    question: "What is the correct way to create a React component?",
    type: "single-choice" as const,
    options: [
      "function MyComponent() { return <div>Hello</div>; }",
      "class MyComponent { render() { return <div>Hello</div>; } }",
      "const MyComponent = () => <div>Hello</div>;",
      "All of the above"
    ],
    correctAnswer: "All of the above",
    explanation: "All three methods are valid ways to create React components.",
    points: 10,
    difficulty: "easy" as const,
    tags: ["components", "basics"]
  },
  {
    id: "react-2",
    question: "Which of the following are React hooks?",
    type: "multiple-choice" as const,
    options: [
      "useState",
      "useEffect",
      "useContext",
      "useReducer",
      "componentDidMount",
      "render"
    ],
    correctAnswer: ["useState", "useEffect", "useContext", "useReducer"],
    explanation: "useState, useEffect, useContext, and useReducer are all React hooks. componentDidMount and render are class component lifecycle methods.",
    points: 15,
    difficulty: "medium" as const,
    tags: ["hooks", "functional-components"]
  },
  {
    id: "react-3",
    question: "Write a simple React component that displays a counter with increment and decrement buttons.",
    type: "code" as const,
    correctAnswer: "function Counter() { const [count, setCount] = useState(0); return (<div><p>{count}</p><button onClick={() => setCount(count + 1)}>+</button><button onClick={() => setCount(count - 1)}>-</button></div>); }",
    explanation: "A basic counter component using useState hook.",
    points: 25,
    difficulty: "medium" as const,
    tags: ["hooks", "state", "components"]
  }
]

// Encrypt the answers
const encryptedQuestions = reactQuestions.map(q => ({
  ...q,
  correctAnswer: encryptAnswerAdvanced(q.correctAnswer, q.id)
}))

export function ReactQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(5 * 60) // 5 minutes
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
    setTimeRemaining(5 * 60)
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
              React Quiz Complete!
            </CardTitle>
            <CardDescription className="text-lg">
              You scored {result.correctAnswers} out of {result.totalQuestions} questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Progress value={result.percentage} className="w-full h-3" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold">React Fundamentals Quiz</CardTitle>
              <CardDescription className="text-base mt-2">Test your knowledge of React basics</CardDescription>
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

      <div className="space-y-3">
        {question.type === 'single-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option: string, index: number) => (
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
            {question.options.map((option: string, index: number) => (
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
