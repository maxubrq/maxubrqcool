'use client'

import React, { ReactNode } from 'react'
import { QuizConfig, type QuizQuestion } from '@/lib/quiz/types'
import { Quiz } from './Quiz'
import { QuizProvider, useQuizContext } from './QuizContext'

interface QuizBuilderProps {
  title: string
  description?: string
  timeLimit?: number
  passingScore?: number
  allowRetake?: boolean
  showCorrectAnswers?: boolean
  randomizeQuestions?: boolean
  randomizeOptions?: boolean
  children: ReactNode
}

interface QuizQuestionProps {
  id: string
  question: string
  type: 'multiple-choice' | 'single-choice' | 'text' | 'code'
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  children?: ReactNode
}

interface QuizQuestionWrapperProps {
  children: ReactNode
}

function QuizBuilderContent({
  title,
  description,
  timeLimit,
  passingScore = 70,
  allowRetake = true,
  showCorrectAnswers = true,
  randomizeQuestions = false,
  randomizeOptions = false,
  children
}: QuizBuilderProps) {
  const { questions } = useQuizContext()
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    // Give some time for questions to be registered
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">⚠️ No questions found</div>
        <p className="text-gray-600">
          Make sure to include QuizQuestion components inside QuizBuilder.
        </p>
      </div>
    )
  }

  const config: QuizConfig = {
    id: `quiz-${Date.now()}`,
    title,
    description,
    questions,
    timeLimit,
    passingScore,
    allowRetake,
    showCorrectAnswers,
    randomizeQuestions,
    randomizeOptions
  }

  return <Quiz config={config} />
}

export function QuizBuilder(props: QuizBuilderProps) {
  return (
    <QuizProvider>
      <QuizBuilderContent {...props} />
    </QuizProvider>
  )
}

export function QuizQuestionWrapper({
  id,
  question,
  type,
  options = [],
  correctAnswer,
  explanation,
  points,
  difficulty,
  tags = [],
  children
}: QuizQuestionProps) {
  // This component is used for configuration only
  // The actual rendering is handled by QuizBuilder
  return null
}

// Helper components for easier quiz creation
export function QuizQuestion({
  id,
  question,
  type,
  options = [],
  correctAnswer,
  explanation,
  points,
  difficulty,
  tags = [],
  children
}: QuizQuestionProps) {
  const { addQuestion } = useQuizContext()

  React.useEffect(() => {
    const questionData = {
      id,
      question,
      type,
      options,
      correctAnswer,
      explanation,
      points,
      difficulty,
      tags
    }
    
    addQuestion(questionData)
  }, [id, question, type, options, correctAnswer, explanation, points, difficulty, tags, addQuestion])

  return (
    <div className="quiz-question-content">
      {children}
    </div>
  )
}

// Export the main components
export { Quiz }
