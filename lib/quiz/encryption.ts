/**
 * Simple client-side encryption for quiz answers
 * This is not cryptographically secure but prevents casual inspection
 */

const ENCRYPTION_KEY = 'quiz-encryption-key-2024'

// Simple XOR cipher for obfuscation
function xorCipher(text: string, key: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i)
    const keyChar = key.charCodeAt(i % key.length)
    result += String.fromCharCode(textChar ^ keyChar)
  }
  return result
}

// Base64 encode the XOR result for additional obfuscation
export function encryptAnswer(answer: string | string[]): string {
  const answerStr = Array.isArray(answer) ? answer.join('|') : answer
  const encrypted = xorCipher(answerStr, ENCRYPTION_KEY)
  return btoa(encrypted)
}

export function decryptAnswer(encryptedAnswer: string): string {
  try {
    const decoded = atob(encryptedAnswer)
    const decrypted = xorCipher(decoded, ENCRYPTION_KEY)
    return decrypted
  } catch (error) {
    console.error('Failed to decrypt answer:', error)
    return ''
  }
}

// Hash function for additional obfuscation
export function hashAnswer(answer: string): string {
  let hash = 0
  for (let i = 0; i < answer.length; i++) {
    const char = answer.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}

// Create a more complex encryption key based on the question
export function generateQuestionKey(questionId: string, salt: string = 'quiz-salt'): string {
  return `${ENCRYPTION_KEY}-${questionId}-${salt}`
}

// Advanced encryption with question-specific keys
export function encryptAnswerAdvanced(answer: string | string[], questionId: string): string {
  const answerStr = Array.isArray(answer) ? answer.join('|') : answer
  const key = generateQuestionKey(questionId)
  const encrypted = xorCipher(answerStr, key)
  return btoa(encrypted)
}

export function decryptAnswerAdvanced(encryptedAnswer: string, questionId: string): string {
  try {
    const key = generateQuestionKey(questionId)
    const decoded = atob(encryptedAnswer)
    const decrypted = xorCipher(decoded, key)
    return decrypted
  } catch (error) {
    console.error('Failed to decrypt answer:', error)
    return ''
  }
}
