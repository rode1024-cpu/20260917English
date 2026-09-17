import { useEffect, useMemo, useState } from 'react'
import { useCardStore } from '../../store/useCardStore'
import { useKeydown } from '../../hooks/useKeydown'
import { Flashcard } from './Flashcard'
import type { ReviewGrade } from '../../types/card'

const GRADE_BUTTONS: { grade: ReviewGrade; label: string; key: string; className: string }[] = [
  {
    grade: 'again',
    label: '1. 다시',
    key: '1',
    className: 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950',
  },
  {
    grade: 'hard',
    label: '2. 어려움',
    key: '2',
    className: 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950',
  },
  {
    grade: 'good',
    label: '3. 보통',
    key: '3',
    className: 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-950',
  },
  {
    grade: 'easy',
    label: '4. 쉬움',
    key: '4',
    className: 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950',
  },
]

export function StudyView() {
  const cards = useCardStore((state) => state.cards)
  const getDueCards = useCardStore((state) => state.getDueCards)
  const reviewCard = useCardStore((state) => state.reviewCard)

  // 학습 도중 카드 순서가 바뀌지 않도록, 세션 시작 시점의 복습 대상 id 목록을 고정한다.
  const [queueIds, setQueueIds] = useState<string[]>(() => getDueCards().map((c) => c.id))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // cards 데이터가 처음 로드된 뒤(초기값이 빈 배열이었던 경우) 큐를 다시 채운다.
  useEffect(() => {
    setQueueIds((prev) => (prev.length === 0 && cards.length > 0 ? getDueCards().map((c) => c.id) : prev))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length])

  const currentCard = useMemo(() => {
    const id = queueIds[index]
    return cards.find((c) => c.id === id) ?? null
  }, [cards, queueIds, index])

  const handleFlip = () => setFlipped((prev) => !prev)

  const handleGrade = (grade: ReviewGrade) => {
    if (!currentCard) return
    reviewCard(currentCard.id, grade)
    setFlipped(false)
    setIndex((prev) => prev + 1)
  }

  useKeydown(
    (event) => {
      if (!currentCard) return
      if (event.code === 'Space') {
        event.preventDefault()
        handleFlip()
        return
      }
      if (!flipped) return
      const button = GRADE_BUTTONS.find((b) => b.key === event.key)
      if (button) handleGrade(button.grade)
    },
    [currentCard, flipped],
  )

  const remaining = queueIds.length - index

  if (!currentCard) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg font-medium">오늘 복습할 카드가 없습니다</p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          내일 다시 방문해서 예정된 카드를 복습해 보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">남은 카드: {remaining}장</p>
      <Flashcard card={currentCard} flipped={flipped} onFlip={handleFlip} />
      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {GRADE_BUTTONS.map((button) => (
            <button
              key={button.grade}
              type="button"
              onClick={() => handleGrade(button.grade)}
              className={`rounded-md border px-2 py-2 text-sm font-medium transition-colors ${button.className}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
      <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
        스페이스바: 카드 뒤집기 · 숫자키 1~4: 난이도 선택
      </p>
    </div>
  )
}
