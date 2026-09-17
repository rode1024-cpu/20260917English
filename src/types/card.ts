/** 사용자가 학습 카드에 대해 내리는 4단계 응답 */
export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy'

/** 단어 카드 데이터 모델 (SM-2 간격 반복에 필요한 필드 포함) */
export interface WordCard {
  id: string
  word: string
  meaning: string
  exampleSentence: string
  exampleTranslation: string
  /** 정답률에 따라 조정되는 난이도 계수, 초기값 2.5 */
  easeFactor: number
  /** 다음 복습까지의 간격(일 단위) */
  interval: number
  /** 연속으로 정답을 맞춘 횟수 */
  repetitions: number
  /** 다음 복습 예정일 (ISO 날짜, yyyy-MM-dd) */
  nextReviewDate: string
  /** 카드 생성일 (ISO 날짜) */
  createdAt: string
}

/** 새 카드를 만들 때 사용자가 입력하는 값 */
export type NewWordCardInput = Pick<
  WordCard,
  'word' | 'meaning' | 'exampleSentence' | 'exampleTranslation'
>

/** 날짜별 학습 완료 카드 수 기록 (대시보드 그래프용) */
export interface StudyLogEntry {
  /** ISO 날짜, yyyy-MM-dd */
  date: string
  count: number
}
