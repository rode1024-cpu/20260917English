import { create } from 'zustand'
import { todayKey, isOnOrBefore, lastNDays } from '../lib/date'
import { localStorageAdapter } from '../lib/storage/localStorageAdapter'
import { createSeedCards } from '../lib/seedData'
import { calculateSm2, createInitialSm2State } from '../lib/sm2'
import type { DataStorage } from '../lib/storage/DataStorage'
import type { NewWordCardInput, ReviewGrade, StudyLogEntry, WordCard } from '../types/card'

interface CardStoreState {
  cards: WordCard[]
  studyLog: StudyLogEntry[]
  storage: DataStorage
  initialize: () => void
  getDueCards: () => WordCard[]
  reviewCard: (id: string, grade: ReviewGrade) => void
  addCard: (input: NewWordCardInput) => void
  updateCard: (id: string, input: NewWordCardInput) => void
  deleteCard: (id: string) => void
  getTodayStudiedCount: () => number
  getLast7DaysLog: () => StudyLogEntry[]
  exportData: () => string
  importData: (json: string) => { success: boolean; error?: string }
}

function bumpStudyLog(log: StudyLogEntry[]): StudyLogEntry[] {
  const today = todayKey()
  const existing = log.find((entry) => entry.date === today)
  if (existing) {
    return log.map((entry) => (entry.date === today ? { ...entry, count: entry.count + 1 } : entry))
  }
  return [...log, { date: today, count: 1 }]
}

export const useCardStore = create<CardStoreState>((set, get) => ({
  cards: [],
  studyLog: [],
  storage: localStorageAdapter,

  initialize: () => {
    const { storage } = get()
    let cards = storage.loadCards()
    if (cards.length === 0) {
      cards = createSeedCards()
      storage.saveCards(cards)
    }
    const studyLog = storage.loadStudyLog()
    set({ cards, studyLog })
  },

  getDueCards: () => {
    const today = todayKey()
    return get()
      .cards.filter((card) => isOnOrBefore(card.nextReviewDate, today))
      .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
  },

  reviewCard: (id, grade) => {
    const { cards, storage, studyLog } = get()
    const today = todayKey()
    const nextCards = cards.map((card) => {
      if (card.id !== id) return card
      const result = calculateSm2(card, grade, today)
      return { ...card, ...result }
    })
    const nextLog = bumpStudyLog(studyLog)
    storage.saveCards(nextCards)
    storage.saveStudyLog(nextLog)
    set({ cards: nextCards, studyLog: nextLog })
  },

  addCard: (input) => {
    const { cards, storage } = get()
    const today = todayKey()
    const newCard: WordCard = {
      id: crypto.randomUUID(),
      ...input,
      ...createInitialSm2State(today),
      createdAt: today,
    }
    const nextCards = [...cards, newCard]
    storage.saveCards(nextCards)
    set({ cards: nextCards })
  },

  updateCard: (id, input) => {
    const { cards, storage } = get()
    const nextCards = cards.map((card) => (card.id === id ? { ...card, ...input } : card))
    storage.saveCards(nextCards)
    set({ cards: nextCards })
  },

  deleteCard: (id) => {
    const { cards, storage } = get()
    const nextCards = cards.filter((card) => card.id !== id)
    storage.saveCards(nextCards)
    set({ cards: nextCards })
  },

  getTodayStudiedCount: () => {
    const today = todayKey()
    return get().studyLog.find((entry) => entry.date === today)?.count ?? 0
  },

  getLast7DaysLog: () => {
    const { studyLog } = get()
    return lastNDays(7).map((date) => ({
      date,
      count: studyLog.find((entry) => entry.date === date)?.count ?? 0,
    }))
  },

  exportData: () => {
    const { cards, studyLog } = get()
    return JSON.stringify({ cards, studyLog, exportedAt: new Date().toISOString() }, null, 2)
  },

  importData: (json) => {
    try {
      const parsed = JSON.parse(json) as { cards?: unknown; studyLog?: unknown }
      if (!Array.isArray(parsed.cards)) {
        return { success: false, error: '올바르지 않은 파일 형식입니다 (cards 배열이 없음).' }
      }
      const { storage } = get()
      const cards = parsed.cards as WordCard[]
      const studyLog = Array.isArray(parsed.studyLog) ? (parsed.studyLog as StudyLogEntry[]) : []
      storage.saveCards(cards)
      storage.saveStudyLog(studyLog)
      set({ cards, studyLog })
      return { success: true }
    } catch {
      return { success: false, error: 'JSON 파일을 읽는 중 오류가 발생했습니다.' }
    }
  },
}))
