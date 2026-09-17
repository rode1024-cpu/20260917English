import { useState } from 'react'
import { useApiKey } from '../../hooks/useApiKey'
import { useCardStore } from '../../store/useCardStore'
import { generateCurriculum } from '../../lib/gemini'
import type { CurriculumLevel, CurriculumRequest, CurriculumResult } from '../../types/curriculum'

const LEVEL_OPTIONS: { value: CurriculumLevel; label: string }[] = [
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
]

const inputClassName =
  'rounded-md border border-zinc-300 bg-transparent px-3 py-2 focus:border-blue-600 focus:outline-none dark:border-zinc-700'

export function CurriculumGenerator() {
  const { apiKey, setApiKey } = useApiKey()
  const cards = useCardStore((state) => state.cards)
  const addCards = useCardStore((state) => state.addCards)

  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState<CurriculumLevel>('beginner')
  const [weeks, setWeeks] = useState(2)
  const [wordsPerWeek, setWordsPerWeek] = useState(8)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CurriculumResult | null>(null)
  const [addedWeeks, setAddedWeeks] = useState<Set<number>>(new Set())

  const canGenerate = apiKey.trim().length > 0 && topic.trim().length > 0 && !loading

  const handleGenerate = async () => {
    if (!canGenerate) return
    setLoading(true)
    setError(null)
    setResult(null)
    setAddedWeeks(new Set())
    try {
      const request: CurriculumRequest = { topic: topic.trim(), level, weeks, wordsPerWeek }
      const curriculum = await generateCurriculum(apiKey.trim(), request)
      setResult(curriculum)
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const existingWords = () => new Set(cards.map((c) => c.word.toLowerCase()))

  const addWeek = (weekNumber: number) => {
    if (!result) return
    const week = result.weeks.find((w) => w.week === weekNumber)
    if (!week) return
    const seen = existingWords()
    addCards(week.words.filter((w) => !seen.has(w.word.toLowerCase())))
    setAddedWeeks((prev) => new Set(prev).add(weekNumber))
  }

  const addAll = () => {
    if (!result) return
    const seen = existingWords()
    const allWords = result.weeks.flatMap((w) => w.words)
    addCards(allWords.filter((w) => !seen.has(w.word.toLowerCase())))
    setAddedWeeks(new Set(result.weeks.map((w) => w.week)))
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="font-medium">Gemini API 키</h3>
        <p className="mb-3 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          이 기능은 Google Gemini API를 브라우저에서 직접 호출합니다. API 키는 이 브라우저의 로컬 저장소에만
          저장되며 외부 서버로 전송되지 않지만, 사용량에 따라 요금이 발생할 수 있습니다.
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Gemini API 키 입력"
          autoComplete="off"
          className={`w-full ${inputClassName}`}
        />
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 font-medium">AI 커리큘럼 생성</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="주제 (예: 해외 여행, 비즈니스 이메일)"
            className={`sm:col-span-2 ${inputClassName}`}
          />
          <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            난이도
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as CurriculumLevel)}
              className={`flex-1 ${inputClassName}`}
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <label className="flex flex-1 items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              주차
              <input
                type="number"
                min={1}
                max={12}
                value={weeks}
                onChange={(e) => setWeeks(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
                className={`w-full ${inputClassName}`}
              />
            </label>
            <label className="flex flex-1 items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              주당 단어
              <input
                type="number"
                min={3}
                max={20}
                value={wordsPerWeek}
                onChange={(e) => setWordsPerWeek(Math.min(20, Math.max(3, Number(e.target.value) || 3)))}
                className={`w-full ${inputClassName}`}
              />
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="mt-4 rounded-md bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-blue-950 hover:bg-yellow-300 disabled:opacity-40"
        >
          {loading ? '생성 중...' : '커리큘럼 생성하기'}
        </button>

        {error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      </div>

      {result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{result.title}</h3>
            <button
              type="button"
              onClick={addAll}
              className="shrink-0 rounded-md border border-blue-950 px-3 py-1.5 text-sm font-medium text-blue-950 hover:bg-blue-50 dark:border-blue-300 dark:text-blue-200 dark:hover:bg-blue-950/40"
            >
              전체 추가하기
            </button>
          </div>

          {result.weeks.map((week) => (
            <div
              key={week.week}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-medium">
                  {week.week}주차 · {week.theme}
                </p>
                <button
                  type="button"
                  onClick={() => addWeek(week.week)}
                  disabled={addedWeeks.has(week.week)}
                  className="shrink-0 rounded-md px-3 py-1 text-sm text-blue-800 hover:bg-blue-50 disabled:text-zinc-400 disabled:hover:bg-transparent dark:text-blue-300 dark:hover:bg-blue-950/40"
                >
                  {addedWeeks.has(week.week) ? '추가됨' : '이 주차 추가'}
                </button>
              </div>
              <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                {week.words.map((w) => (
                  <li key={w.word} className="py-2 text-sm">
                    <p className="font-medium">
                      {w.word} <span className="font-normal text-zinc-500 dark:text-zinc-400">- {w.meaning}</span>
                    </p>
                    <p className="text-zinc-400 dark:text-zinc-500">{w.exampleSentence}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
