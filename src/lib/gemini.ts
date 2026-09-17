import type { CurriculumRequest, CurriculumResult, GeneratedWord } from '../types/curriculum'

/** 사용자가 직접 입력한 API 키로 브라우저에서 곧바로 호출한다 (백엔드 프록시 없음). */
const GEMINI_MODEL = 'gemini-3.5-flash-lite'
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

const LEVEL_LABELS: Record<CurriculumRequest['level'], string> = {
  beginner: '초급 (기초 필수 단어 위주)',
  intermediate: '중급 (일상 대화 및 실무 수준)',
  advanced: '고급 (심화 어휘와 뉘앙스 포함)',
}

export function buildCurriculumPrompt(request: CurriculumRequest): string {
  return `당신은 영어 학습 커리큘럼 설계 전문가입니다. 아래 조건에 맞는 영어 단어 학습 커리큘럼을 만들어주세요.

- 주제: ${request.topic}
- 난이도: ${LEVEL_LABELS[request.level]}
- 기간: ${request.weeks}주
- 주차당 단어 수: ${request.wordsPerWeek}개

각 주차는 서로 다른 세부 테마(예: 1주차는 공항, 2주차는 호텔 등)를 가져야 하며,
단어는 주제와 난이도 수준에 맞는 실용적인 어휘여야 합니다.
각 단어에는 자연스러운 영어 예문 한 문장과 그에 대한 한글 번역을 함께 제공하세요.
뜻과 번역은 반드시 한국어로 작성하세요.`
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    weeks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          week: { type: 'INTEGER' },
          theme: { type: 'STRING' },
          words: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                word: { type: 'STRING' },
                meaning: { type: 'STRING' },
                exampleSentence: { type: 'STRING' },
                exampleTranslation: { type: 'STRING' },
              },
              required: ['word', 'meaning', 'exampleSentence', 'exampleTranslation'],
            },
          },
        },
        required: ['week', 'theme', 'words'],
      },
    },
  },
  required: ['title', 'weeks'],
} as const

function isGeneratedWord(value: unknown): value is GeneratedWord {
  if (!value || typeof value !== 'object') return false
  const w = value as Record<string, unknown>
  return (
    typeof w.word === 'string' &&
    w.word.trim().length > 0 &&
    typeof w.meaning === 'string' &&
    w.meaning.trim().length > 0 &&
    typeof w.exampleSentence === 'string' &&
    typeof w.exampleTranslation === 'string'
  )
}

/**
 * Gemini 응답 텍스트(JSON 문자열)를 파싱한다.
 * 스키마를 강제했더라도 모델이 필드를 누락할 수 있으므로 각 항목을 검증하고,
 * 형식이 잘못된 단어나 빈 주차는 걸러낸다.
 */
export function parseCurriculumResponse(text: string): CurriculumResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('AI 응답이 올바른 JSON 형식이 아닙니다.')
  }

  const raw = parsed as { title?: unknown; weeks?: unknown }
  if (typeof raw.title !== 'string' || !Array.isArray(raw.weeks)) {
    throw new Error('AI 응답 형식이 예상과 다릅니다.')
  }

  const weeks = raw.weeks
    .map((entry, i) => {
      const week = entry as { week?: unknown; theme?: unknown; words?: unknown }
      const words = Array.isArray(week.words) ? week.words.filter(isGeneratedWord) : []
      return {
        week: typeof week.week === 'number' ? week.week : i + 1,
        theme: typeof week.theme === 'string' && week.theme.trim() ? week.theme : `${i + 1}주차`,
        words,
      }
    })
    .filter((week) => week.words.length > 0)

  if (weeks.length === 0) {
    throw new Error('생성된 단어가 없습니다. 다른 조건으로 다시 시도해 주세요.')
  }

  return { title: raw.title, weeks }
}

function describeErrorStatus(status: number): string {
  if (status === 400 || status === 403) {
    return 'API 키가 올바르지 않거나 권한이 없습니다. API 키를 확인해 주세요.'
  }
  if (status === 429) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
  }
  return `Gemini API 요청이 실패했습니다 (상태 코드 ${status}).`
}

export async function generateCurriculum(apiKey: string, request: CurriculumRequest): Promise<CurriculumResult> {
  const prompt = buildCurriculumPrompt(request)
  const res = await fetch(`${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  })

  if (!res.ok) {
    throw new Error(describeErrorStatus(res.status))
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof text !== 'string') {
    throw new Error('AI 응답을 받지 못했습니다.')
  }
  return parseCurriculumResponse(text)
}
