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
        className="flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <span className="text-3xl font-semibold tracking-tight">{card.word}</span>

        {flipped ? (
          <div className="flex flex-col gap-2">
            <p className="text-lg text-blue-800 dark:text-blue-300">{card.meaning}</p>
            <p className="italic text-zinc-500 dark:text-zinc-400">{card.exampleSentence}</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">{card.exampleTranslation}</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">스페이스바 또는 클릭해서 뒤집기</p>
        )}
      </button>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          disabled={!supported}
          onClick={(event) => {
            event.stopPropagation()
            speak(card.word)
          }}
          className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          🔊 발음 듣기
        </button>
      </div>
      {!supported && (
        <p className="mt-1 text-center text-xs text-zinc-400 dark:text-zinc-500">
          이 브라우저는 음성 합성(Web Speech API)을 지원하지 않아 발음 듣기를 사용할 수 없습니다.
        </p>
      )}
    </div>
  )
}
