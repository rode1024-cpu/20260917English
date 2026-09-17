import { describe, expect, it } from 'vitest'
import { calculateSm2, createInitialSm2State } from './sm2'

const BASE = { easeFactor: 2.5, interval: 6, repetitions: 2 }
const TODAY = '2026-01-10'

describe('calculateSm2', () => {
  it('다시(again): 반복 횟수와 interval을 초기화하고 ease factor를 크게 낮춘다', () => {
    const result = calculateSm2(BASE, 'again', TODAY)
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
    expect(result.easeFactor).toBeLessThan(BASE.easeFactor)
    expect(result.nextReviewDate).toBe('2026-01-11')
  })

  it('어려움(hard): repetitions는 늘지만 ease factor는 소폭 감소한다', () => {
    const result = calculateSm2(BASE, 'hard', TODAY)
    expect(result.repetitions).toBe(3)
    expect(result.easeFactor).toBeLessThan(BASE.easeFactor)
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3)
    // repetitions가 3 이상이므로 interval = round(6 * easeFactor)
    expect(result.interval).toBe(Math.round(BASE.interval * result.easeFactor))
  })

  it('보통(good): quality=4에서는 ease factor가 그대로 유지된다', () => {
    const result = calculateSm2(BASE, 'good', TODAY)
    expect(result.easeFactor).toBeCloseTo(BASE.easeFactor, 5)
    expect(result.repetitions).toBe(3)
  })

  it('쉬움(easy): ease factor가 증가하고 interval도 더 길어진다', () => {
    const good = calculateSm2(BASE, 'good', TODAY)
    const easy = calculateSm2(BASE, 'easy', TODAY)
    expect(easy.easeFactor).toBeGreaterThan(BASE.easeFactor)
    expect(easy.interval).toBeGreaterThan(good.interval)
  })

  it('첫 번째 정답은 1일, 두 번째 연속 정답은 6일 뒤로 설정된다', () => {
    const first = calculateSm2({ easeFactor: 2.5, interval: 0, repetitions: 0 }, 'good', TODAY)
    expect(first.repetitions).toBe(1)
    expect(first.interval).toBe(1)

    const second = calculateSm2(
      { easeFactor: first.easeFactor, interval: first.interval, repetitions: first.repetitions },
      'good',
      first.nextReviewDate,
    )
    expect(second.repetitions).toBe(2)
    expect(second.interval).toBe(6)
  })

  it('ease factor는 1.3 밑으로 내려가지 않는다', () => {
    let state = { easeFactor: 1.35, interval: 1, repetitions: 1 }
    for (let i = 0; i < 5; i += 1) {
      const result = calculateSm2(state, 'again', TODAY)
      state = { easeFactor: result.easeFactor, interval: result.interval, repetitions: result.repetitions }
    }
    expect(state.easeFactor).toBeGreaterThanOrEqual(1.3)
  })
})

describe('createInitialSm2State', () => {
  it('초기 ease factor는 2.5이고 오늘 날짜가 다음 복습일로 설정된다', () => {
    const state = createInitialSm2State(TODAY)
    expect(state.easeFactor).toBe(2.5)
    expect(state.interval).toBe(0)
    expect(state.repetitions).toBe(0)
    expect(state.nextReviewDate).toBe(TODAY)
  })
})
