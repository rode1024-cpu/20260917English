import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Flashcard } from './Flashcard'
import type { WordCard } from '../../types/card'

const CARD: WordCard = {
  id: 'id-1',
  word: 'achieve',
  meaning: '성취하다',
  exampleSentence: 'She worked hard to achieve her goals.',
  exampleTranslation: '그녀는 목표를 이루기 위해 열심히 노력했다.',
  easeFactor: 2.5,
  interval: 0,
  repetitions: 0,
  nextReviewDate: '2026-01-01',
  createdAt: '2026-01-01',
}

describe('Flashcard', () => {
  it('뒤집기 전에는 단어만 보이고 뜻은 숨겨진다', () => {
    render(<Flashcard card={CARD} flipped={false} onFlip={vi.fn()} />)
    expect(screen.getByText('achieve')).toBeInTheDocument()
    expect(screen.queryByText('성취하다')).not.toBeInTheDocument()
  })

  it('뒤집힌 상태에서는 뜻과 예문이 표시된다', () => {
    render(<Flashcard card={CARD} flipped={true} onFlip={vi.fn()} />)
    expect(screen.getByText('성취하다')).toBeInTheDocument()
    expect(screen.getByText(CARD.exampleSentence)).toBeInTheDocument()
  })

  it('카드를 클릭하면 onFlip이 호출된다', async () => {
    const onFlip = vi.fn()
    render(<Flashcard card={CARD} flipped={false} onFlip={onFlip} />)
    await userEvent.click(screen.getByText('achieve'))
    expect(onFlip).toHaveBeenCalledTimes(1)
  })
})
