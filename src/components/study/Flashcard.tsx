import { useSpeech } from '../../hooks/useSpeech'
import type { WordCard } from '../../types/card'

interface FlashcardProps {
  card: WordCard
  flipped: boolean
  onFlip: () => void
}

export function Flashcard({ card, flipped, onFlip }: FlashcardProps) {
  const { supported, speak } = useSpeech()

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onFlip}
        aria-label={flipped ? '카드 앞면 보기' : '카드 뒤집어 정답 보기'}
        className="flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
      >
        <span className="text-3xl font-bold">{card.word}</span>

        {flipped ? (
          <div className="flex flex-col gap-2 text-slate-600 dark:text-slate-300">
            <p className="text-xl font-semibold text-sky-600 dark:text-sky-400">{card.meaning}</p>
            <p className="italic">{card.exampleSentence}</p>
            <p className="text-sm">{card.exampleTranslation}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">스페이스바 또는 클릭해서 뒤집기</p>
        )}
      </button>

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          disabled={!supported}
          onClick={(event) => {
            event.stopPropagation()
            speak(card.word)
          }}
          className="rounded-md border border-slate-200 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
        >
          🔊 발음 듣기
        </button>
      </div>
      {!supported && (
        <p className="mt-1 text-center text-xs text-slate-400">
          이 브라우저는 음성 합성(Web Speech API)을 지원하지 않아 발음 듣기를 사용할 수 없습니다.
        </p>
      )}
    </div>
  )
}
