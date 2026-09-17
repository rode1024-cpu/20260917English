import { describe, expect, it } from 'vitest'
import { buildCurriculumPrompt, parseCurriculumResponse } from './gemini'
import type { CurriculumRequest } from '../types/curriculum'

describe('buildCurriculumPrompt', () => {
  it('요청 조건(주제/난이도/기간/단어 수)을 프롬프트에 포함한다', () => {
    const request: CurriculumRequest = { topic: '해외 여행', level: 'beginner', weeks: 3, wordsPerWeek: 10 }
    const prompt = buildCurriculumPrompt(request)
    expect(prompt).toContain('해외 여행')
    expect(prompt).toContain('3주')
    expect(prompt).toContain('10개')
  })
})

describe('parseCurriculumResponse', () => {
  it('올바른 형식의 JSON을 파싱한다', () => {
    const json = JSON.stringify({
      title: '여행 영어 2주 커리큘럼',
      weeks: [
        {
          week: 1,
          theme: '공항',
          words: [
            { word: 'airport', meaning: '공항', exampleSentence: 'I am at the airport.', exampleTranslation: '나는 공항에 있다.' },
          ],
        },
      ],
    })
    const result = parseCurriculumResponse(json)
    expect(result.title).toBe('여행 영어 2주 커리큘럼')
    expect(result.weeks).toHaveLength(1)
    expect(result.weeks[0].words).toHaveLength(1)
  })

  it('형식이 잘못된 단어 항목은 걸러낸다', () => {
    const json = JSON.stringify({
      title: '테스트',
      weeks: [
        {
          week: 1,
          theme: '테마',
          words: [
            { word: 'valid', meaning: '유효한', exampleSentence: 'x', exampleTranslation: 'y' },
            { word: '', meaning: '빈 단어', exampleSentence: 'x', exampleTranslation: 'y' },
            { meaning: '단어 필드 없음', exampleSentence: 'x', exampleTranslation: 'y' },
          ],
        },
      ],
    })
    const result = parseCurriculumResponse(json)
    expect(result.weeks[0].words).toHaveLength(1)
    expect(result.weeks[0].words[0].word).toBe('valid')
  })

  it('모든 단어가 걸러져 빈 주차만 남으면 에러를 던진다', () => {
    const json = JSON.stringify({
      title: '테스트',
      weeks: [{ week: 1, theme: '테마', words: [] }],
    })
    expect(() => parseCurriculumResponse(json)).toThrow()
  })

  it('JSON 형식이 아니면 에러를 던진다', () => {
    expect(() => parseCurriculumResponse('not json')).toThrow()
  })

  it('필수 필드(title, weeks)가 없으면 에러를 던진다', () => {
    expect(() => parseCurriculumResponse(JSON.stringify({ foo: 'bar' }))).toThrow()
  })
})
