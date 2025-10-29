'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { QuizQuestion } from '@/lib/quiz/types'
import { encryptAnswerAdvanced } from '@/lib/quiz/encryption'

interface QuizContextType {
  addQuestion: (question: QuizQuestion) => void
  questions: QuizQuestion[]
  resetQuestions: () => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  const addQuestion = useCallback((question: QuizQuestion) => {
    const encryptedAnswer = encryptAnswerAdvanced(question.correctAnswer, question.id)
    setQuestions(prev => {
      const nextQuestion = { ...question, correctAnswer: encryptedAnswer }
      const existingIndex = prev.findIndex(q => q.id === question.id)
      if (existingIndex !== -1) {
        const updated = [...prev]
        updated[existingIndex] = nextQuestion
        return updated
      }
      return [...prev, nextQuestion]
    })
  }, [])

  const resetQuestions = useCallback(() => {
    setQuestions([])
  }, [])

  return (
    <QuizContext.Provider value={{ addQuestion, questions, resetQuestions }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuizContext() {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider')
  }
  return context
}
