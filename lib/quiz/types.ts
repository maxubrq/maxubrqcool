export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'single-choice' | 'text' | 'code'
  options?: string[]
  correctAnswer: string | string[] // Encrypted answer
  explanation?: string
  points?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
}

export interface QuizConfig {
  id: string
  title: string
  description?: string
  questions: QuizQuestion[]
  timeLimit?: number // in minutes
  passingScore?: number // percentage
  allowRetake?: boolean
  showCorrectAnswers?: boolean
  randomizeQuestions?: boolean
  randomizeOptions?: boolean
}

export interface QuizState {
  currentQuestionIndex: number
  answers: Record<string, string | string[]>
  timeRemaining?: number
  isSubmitted: boolean
  score?: number
  isPassed?: boolean
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  percentage: number
  isPassed: boolean
  timeSpent: number
  answers: Array<{
    questionId: string
    userAnswer: string | string[]
    correctAnswer: string | string[]
    isCorrect: boolean
    explanation?: string
  }>
}

export interface QuizProps {
  config: QuizConfig
  onComplete?: (result: QuizResult) => void
  onQuestionChange?: (questionIndex: number) => void
  className?: string
}
