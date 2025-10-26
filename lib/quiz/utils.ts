import { QuizQuestion, QuizResult, QuizState } from './types'
import { decryptAnswerAdvanced } from './encryption'

export function calculateScore(
  questions: QuizQuestion[],
  answers: Record<string, string | string[]>
): QuizResult {
  let correctAnswers = 0
  const resultAnswers: QuizResult['answers'] = []

  questions.forEach((question) => {
    const userAnswer = answers[question.id]
    const correctAnswer = decryptAnswerAdvanced(question.correctAnswer, question.id)
    
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

  const percentage = Math.round((correctAnswers / questions.length) * 100)
  
  return {
    score: correctAnswers,
    totalQuestions: questions.length,
    correctAnswers,
    percentage,
    isPassed: percentage >= 70, // Default passing score
    timeSpent: 0, // This would be calculated from the quiz state
    answers: resultAnswers
  }
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function getDifficultyColor(difficulty?: string): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'hard':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getDifficultyIcon(difficulty?: string): string {
  switch (difficulty) {
    case 'easy':
      return '🟢'
    case 'medium':
      return '🟡'
    case 'hard':
      return '🔴'
    default:
      return '⚪'
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function validateQuizConfig(config: any): boolean {
  if (!config || !config.questions || !Array.isArray(config.questions)) {
    return false
  }

  return config.questions.every((question: any) => 
    question.id && 
    question.question && 
    question.type && 
    question.correctAnswer
  )
}
