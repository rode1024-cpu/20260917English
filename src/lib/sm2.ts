import { addDays, todayKey } from './date'
import type { ReviewGrade, WordCard } from '../types/card'

/**
 * SM-2 알고리즘은 0~5의 "quality" 점수로 응답 품질을 표현한다.
 * 이 앱은 사용자에게 4단계 버튼(다시/어려움/보통/쉬움)만 노출하므로
 * 각 버튼을 SM-2의 quality 값으로 매핑한다.
 * - 다시(again): 0  -> 완전히 잊음, 처음부터 다시 학습
 * - 어려움(hard): 3  -> 정답이지만 상당히 힘들게 떠올림
 * - 보통(good):  4  -> 약간의 망설임 후 정답
 * - 쉬움(easy):  5  -> 즉시, 완벽하게 정답
 */
const GRADE_TO_QUALITY: Record<ReviewGrade, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
}

const MIN_EASE_FACTOR = 1.3
const INITIAL_EASE_FACTOR = 2.5

export interface Sm2Input {
  easeFactor: number
  interval: number
  repetitions: number
}

export interface Sm2Result {
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
}

/**
 * SM-2 간격 반복 계산.
 * 참고: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 */
export function calculateSm2(input: Sm2Input, grade: ReviewGrade, from: string = todayKey()): Sm2Result {
  const quality = GRADE_TO_QUALITY[grade]

  // 1단계: 새로운 ease factor(난이도 계수)를 계산한다.
  // quality가 낮을수록 ease factor가 크게 감소하고, 높을수록 소폭 증가한다.
  // 최소값(1.3) 밑으로는 내려가지 않도록 고정한다 (카드가 지나치게 자주 나오는 것을 방지).
  let easeFactor =
    input.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easeFactor < MIN_EASE_FACTOR) easeFactor = MIN_EASE_FACTOR

  let repetitions: number
  let interval: number

  // 2단계: quality가 3 미만이면 "실패"로 간주하여 반복 횟수를 초기화하고
  // 다음날 바로 다시 복습하도록 interval을 1로 되돌린다.
  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    // 3단계: 정답인 경우, 반복 횟수를 늘리고 interval을 계산한다.
    // - 첫 번째 정답: 1일 뒤
    // - 두 번째 연속 정답: 6일 뒤
    // - 세 번째 이후: 이전 interval에 ease factor를 곱해 점점 간격을 늘린다.
    repetitions = input.repetitions + 1
    if (repetitions === 1) {
      interval = 1
    } else if (repetitions === 2) {
      interval = 6
    } else {
      interval = Math.round(input.interval * easeFactor)
    }
  }

  // 4단계: 계산된 interval(일)을 기준일에 더해 다음 복습일을 확정한다.
  const nextReviewDate = addDays(from, interval)

  return { easeFactor, interval, repetitions, nextReviewDate }
}

/** 새 카드를 만들 때 사용하는 SM-2 초기값 */
export function createInitialSm2State(today: string = todayKey()): Pick<
  WordCard,
  'easeFactor' | 'interval' | 'repetitions' | 'nextReviewDate'
> {
  return {
    easeFactor: INITIAL_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    // 새 카드는 즉시 학습 대상에 포함되도록 오늘 날짜로 설정한다.
    nextReviewDate: today,
  }
}
