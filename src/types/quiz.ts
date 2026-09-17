export type QuizQuestionType = 'fill-blank' | 'multiple-choice'

interface QuizQuestionBase {
  id: string
  cardId: string
  type: QuizQuestionType
  /** 정답 문자열 (fill-blank: 단어, multiple-choice: 뜻) */
  answer: string
}

export interface FillBlankQuestion extends QuizQuestionBase {
  type: 'fill-blank'
  /** 정답 단어를 빈칸으로 치환한 예문 */
  sentenceWithBlank: string
  sentenceTranslation: string
}

export interface MultipleChoiceQuestion extends QuizQuestionBase {
  type: 'multiple-choice'
  word: string
  /** 정답 포함 4개의 보기 (섞인 상태) */
  options: string[]
}

export type QuizQuestion = FillBlankQuestion | MultipleChoiceQuestion

export interface QuizResult {
  question: QuizQuestion
  userAnswer: string
  isCorrect: boolean
}
