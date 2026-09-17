import { useState } from 'react'
import { useCardStore } from '../../store/useCardStore'
import { generateQuizQuestions, gradeAnswer } from '../../lib/quiz'
import { useKeydown } from '../../hooks/useKeydown'
import type { QuizQuestion, QuizResult } from '../../types/quiz'

const QUIZ_LENGTH = 10

type QuizPhase = 'idle' | 'playing' | 'finished'

export function QuizView() {
  const cards = useCardStore((state) => state.cards)
  const [phase, setPhase] = useState<QuizPhase>('idle')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<QuizResult[]>([])
  const [textAnswer, setTextAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const currentQuestion = questions[index]

  const startQuiz = () => {
    setQuestions(generateQuizQuestions(cards, QUIZ_LENGTH))
    setResults([])
    setIndex(0)
    setTextAnswer('')
    setFeedback(null)
    setPhase('playing')
  }

  const submitAnswer = (answer: string) => {
    if (!currentQuestion || feedback) return
    const isCorrect = gradeAnswer(currentQuestion, answer)
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setResults((prev) => [...prev, { question: currentQuestion, userAnswer: answer, isCorrect }])
  }

  const goNext = () => {
    setFeedback(null)
    setTextAnswer('')
    if (index + 1 >= questions.length) {
      setPhase('finished')
    } else {
      setIndex((prev) => prev + 1)
    }
  }

  useKeydown(
    (event) => {
      if (phase !== 'playing' || !currentQuestion) return
      if (feedback) {
        if (event.key === 'Enter') goNext()
        return
      }
      if (currentQuestion.type === 'multiple-choice') {
        const optionIndex = Number(event.key) - 1
        if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
          submitAnswer(currentQuestion.options[optionIndex])
        }
      }
    },
    [phase, currentQuestion, feedback],
  )

  if (cards.length === 0) {
    return <p className="text-center text-zinc-500 dark:text-zinc-400">퀴즈를 풀려면 먼저 단어 카드를 등록해 주세요.</p>
  }

  if (phase === 'idle') {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-6 text-zinc-500 dark:text-zinc-400">
          예문 빈칸 채우기와 뜻 객관식 문제를 무작위로 풀어보세요.
        </p>
        <button
          type="button"
          onClick={startQuiz}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          퀴즈 시작하기
        </button>
      </div>
    )
  }

  if (phase === 'finished') {
    const correctCount = results.filter((r) => r.isCorrect).length
    return (
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-3xl font-semibold tracking-tight">
            {correctCount} / {results.length}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">정답</p>
        </div>
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {results.map((r) => (
            <li key={r.question.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="font-medium">{r.question.answer}</span>
              {r.isCorrect ? (
                <span className="text-emerald-600 dark:text-emerald-400">정답</span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400">{r.userAnswer || '(무응답)'}</span>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={startQuiz}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          다시 풀기
        </button>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
        문제 {index + 1} / {questions.length}
      </p>

      <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {currentQuestion.type === 'fill-blank' ? (
          <>
            <p className="mb-1 text-lg">{currentQuestion.sentenceWithBlank}</p>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">{currentQuestion.sentenceTranslation}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submitAnswer(textAnswer)
              }}
              className="flex gap-2"
            >
              <input
                autoFocus
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={!!feedback}
                placeholder="빈칸에 들어갈 단어"
                className="flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 focus:border-zinc-500 focus:outline-none dark:border-zinc-700"
              />
              <button
                type="submit"
                disabled={!!feedback}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-zinc-900"
              >
                제출
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mb-6 text-xl font-semibold tracking-tight">{currentQuestion.word}의 뜻은?</p>
            <div className="grid grid-cols-1 gap-2">
              {currentQuestion.options.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  disabled={!!feedback}
                  onClick={() => submitAnswer(option)}
                  className="rounded-md border border-zinc-200 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  {i + 1}. {option}
                </button>
              ))}
            </div>
          </>
        )}

        {feedback && (
          <div className="mt-6 flex items-center justify-between">
            <p className={feedback === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              {feedback === 'correct' ? '정답입니다' : `오답입니다 · 정답: ${currentQuestion.answer}`}
            </p>
            <button
              type="button"
              onClick={goNext}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-zinc-900"
            >
              다음 (Enter)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
