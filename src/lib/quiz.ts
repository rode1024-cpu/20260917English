import type { WordCard } from '../types/card'
import type { FillBlankQuestion, MultipleChoiceQuestion, QuizQuestion } from '../types/quiz'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickRandom<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count)
}

/** 예문에서 단어가 등장하는 부분을 빈칸("_____")으로 치환한다 (대소문자 무시) */
function blankOutWord(sentence: string, word: string): string {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`\\b${escaped}\\b`, 'i')
  if (pattern.test(sentence)) {
    return sentence.replace(pattern, '_____')
  }
  // 예문에 단어가 정확히 포함되지 않은 경우를 대비한 대체 표현
  return `${sentence} (_____)`
}

function buildFillBlankQuestion(card: WordCard): FillBlankQuestion {
  return {
    id: `${card.id}-blank`,
    cardId: card.id,
    type: 'fill-blank',
    answer: card.word,
    sentenceWithBlank: blankOutWord(card.exampleSentence, card.word),
    sentenceTranslation: card.exampleTranslation,
  }
}

function buildMultipleChoiceQuestion(card: WordCard, allCards: WordCard[]): MultipleChoiceQuestion {
  const distractorPool = allCards.filter((c) => c.id !== card.id && c.meaning !== card.meaning)
  const distractors = pickRandom(distractorPool, 3).map((c) => c.meaning)
  const options = shuffle([card.meaning, ...distractors])
  return {
    id: `${card.id}-mc`,
    cardId: card.id,
    type: 'multiple-choice',
    answer: card.meaning,
    word: card.word,
    options,
  }
}

/**
 * 카드 목록으로부터 랜덤 퀴즈 문제를 생성한다.
 * 문제 유형(빈칸 채우기/객관식)도 카드마다 무작위로 결정한다.
 * 객관식 오답 보기를 만들기 위해 최소 4개 이상의 카드가 필요하며,
 * 카드가 부족하면 해당 카드는 빈칸 채우기 문제로 대체된다.
 */
export function generateQuizQuestions(cards: WordCard[], count: number): QuizQuestion[] {
  const targets = pickRandom(cards, Math.min(count, cards.length))
  return targets.map((card) => {
    const canBeMultipleChoice = cards.length >= 4
    const useMultipleChoice = canBeMultipleChoice && Math.random() < 0.5
    return useMultipleChoice ? buildMultipleChoiceQuestion(card, cards) : buildFillBlankQuestion(card)
  })
}

/** 사용자 답안을 채점한다. fill-blank는 대소문자/양끝 공백을 무시하고 비교한다. */
export function gradeAnswer(question: QuizQuestion, userAnswer: string): boolean {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase()
  const normalizedAnswer = question.answer.trim().toLowerCase()
  return normalizedUserAnswer === normalizedAnswer
}
