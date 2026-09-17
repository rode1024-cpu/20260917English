import type { StudyLogEntry, WordCard } from '../../types/card'
import type { DataStorage } from './DataStorage'

const CARDS_KEY = 'vocaloop.cards.v1'
const STUDY_LOG_KEY = 'vocaloop.studyLog.v1'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장 공간 초과 등은 조용히 무시한다 (로컬 전용 앱이므로 치명적이지 않음)
  }
}

export const localStorageAdapter: DataStorage = {
  loadCards() {
    return readJson<WordCard[]>(CARDS_KEY, [])
  },
  saveCards(cards) {
    writeJson(CARDS_KEY, cards)
  },
  loadStudyLog() {
    return readJson<StudyLogEntry[]>(STUDY_LOG_KEY, [])
  },
  saveStudyLog(log) {
    writeJson(STUDY_LOG_KEY, log)
  },
}
