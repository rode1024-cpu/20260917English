import type { StudyLogEntry, WordCard } from '../../types/card'

/**
 * 데이터 저장 계층 인터페이스.
 * 지금은 localStorage로 구현하지만, 추후 IndexedDB나 서버 API로
 * 교체할 때 이 인터페이스만 구현하면 store 코드는 수정할 필요가 없다.
 */
export interface DataStorage {
  loadCards(): WordCard[]
  saveCards(cards: WordCard[]): void
  loadStudyLog(): StudyLogEntry[]
  saveStudyLog(log: StudyLogEntry[]): void
}
