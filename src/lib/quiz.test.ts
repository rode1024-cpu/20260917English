import { describe, expect, it } from 'vitest'
import { generateQuizQuestions, gradeAnswer } from './quiz'
import type { WordCard } from '../types/card'
import type { FillBlankQuestion, MultipleChoiceQuestion } from '../types/quiz'

function makeCard(overrides: Partial<WordCard>): WordCard {
  return {
    id: 'id-1',
    word: 'apple',
    meaning: '사과',
    exampleSentence: 'I ate an apple this morning.',
    exampleTranslation: '나는 오늘 아침에 사과를 먹었다.',
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: '2026-01-01',
    createdAt: '2026-01-01',
    ...overrides,
  }
}

describe('gradeAnswer', () => {
  it('빈칸 채우기 문제는 대소문자와 공백을 무시하고 채점한다', () => {
    const question: FillBlankQuestion = {
      id: 'q1',
      cardId: 'id-1',
      type: 'fill-blank',
      answer: 'apple',
      sentenceWithBlank: 'I ate an _____ this morning.',
      sentenceTranslation: '나는 오늘 아침에 사과를 먹었다.',
    }
    expect(gradeAnswer(question, '  APPLE  ')).toBe(true)
    expect(gradeAnswer(question, 'banana')).toBe(false)
  })

  it('객관식 문제는 정확히 일치하는 보기만 정답으로 처리한다', () => {
    const question: MultipleChoiceQuestion = {
      id: 'q2',
      cardId: 'id-1',
      type: 'multiple-choice',
      answer: '사과',
      word: 'apple',
      options: ['사과', '바나나', '포도', '오렌지'],
    }
    expect(gradeAnswer(question, '사과')).toBe(true)
    expect(gradeAnswer(question, '바나나')).toBe(false)
  })
})

describe('generateQuizQuestions', () => {
  it('요청한 개수만큼(카드 수를 넘지 않는 선에서) 문제를 생성한다', () => {
    const cards = Array.from({ length: 3 }, (_, i) =>
      makeCard({ id: `id-${i}`, word: `word${i}`, meaning: `뜻${i}` }),
    )
    const questions = generateQuizQuestions(cards, 10)
    expect(questions).toHaveLength(3)
  })

  it('카드가 4개 미만이면 객관식 문제를 생성하지 않는다 (오답 보기 부족)', () => {
    const cards = Array.from({ length: 2 }, (_, i) =>
      makeCard({ id: `id-${i}`, word: `word${i}`, meaning: `뜻${i}` }),
    )
    const questions = generateQuizQuestions(cards, 2)
    expect(questions.every((q) => q.type === 'fill-blank')).toBe(true)
  })

  it('객관식 문제의 보기에는 정답이 정확히 하나 포함되고 총 4개다', () => {
    const cards = Array.from({ length: 10 }, (_, i) =>
      makeCard({ id: `id-${i}`, word: `word${i}`, meaning: `뜻${i}` }),
    )
    const questions = generateQuizQuestions(cards, 10)
    const mcQuestions = questions.filter((q): q is MultipleChoiceQuestion => q.type === 'multiple-choice')
    for (const q of mcQuestions) {
      expect(q.options).toHaveLength(4)
      expect(q.options.filter((opt) => opt === q.answer)).toHaveLength(1)
      expect(new Set(q.options).size).toBe(4)
    }
  })
})
