export type CurriculumLevel = 'beginner' | 'intermediate' | 'advanced'

export interface CurriculumRequest {
  topic: string
  level: CurriculumLevel
  weeks: number
  wordsPerWeek: number
}

export interface GeneratedWord {
  word: string
  meaning: string
  exampleSentence: string
  exampleTranslation: string
}

export interface CurriculumWeek {
  week: number
  theme: string
  words: GeneratedWord[]
}

export interface CurriculumResult {
  title: string
  weeks: CurriculumWeek[]
}
