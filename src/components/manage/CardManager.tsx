import { useState } from 'react'
import { useCardStore } from '../../store/useCardStore'
import type { NewWordCardInput, WordCard } from '../../types/card'

const EMPTY_FORM: NewWordCardInput = {
  word: '',
  meaning: '',
  exampleSentence: '',
  exampleTranslation: '',
}

const inputClassName =
  'rounded-md border border-zinc-300 bg-transparent px-3 py-2 focus:border-zinc-500 focus:outline-none dark:border-zinc-700'

function CardForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: NewWordCardInput
  onSubmit: (input: NewWordCardInput) => void
  onCancel?: () => void
}) {
  const [form, setForm] = useState<NewWordCardInput>(initial)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!form.word.trim() || !form.meaning.trim()) return
        onSubmit(form)
      }}
      className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2"
    >
      <input
        value={form.word}
        onChange={(e) => setForm({ ...form, word: e.target.value })}
        placeholder="단어 (예: achieve)"
        required
        className={inputClassName}
      />
      <input
        value={form.meaning}
        onChange={(e) => setForm({ ...form, meaning: e.target.value })}
        placeholder="뜻 (예: 성취하다)"
        required
        className={inputClassName}
      />
      <input
        value={form.exampleSentence}
        onChange={(e) => setForm({ ...form, exampleSentence: e.target.value })}
        placeholder="예문 (영어)"
        className={`${inputClassName} sm:col-span-2`}
      />
      <input
        value={form.exampleTranslation}
        onChange={(e) => setForm({ ...form, exampleTranslation: e.target.value })}
        placeholder="예문 번역 (한글)"
        className={`${inputClassName} sm:col-span-2`}
      />
      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          저장
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}

export function CardManager() {
  const cards = useCardStore((state) => state.cards)
  const addCard = useCardStore((state) => state.addCard)
  const updateCard = useCardStore((state) => state.updateCard)
  const deleteCard = useCardStore((state) => state.deleteCard)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {showAddForm ? (
        <CardForm
          initial={EMPTY_FORM}
          onCancel={() => setShowAddForm(false)}
          onSubmit={(input) => {
            addCard(input)
            setShowAddForm(false)
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="self-start rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          + 새 단어 추가
        </button>
      )}

      <ul className="flex flex-col divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white px-6 shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {cards.map((card: WordCard) =>
          editingId === card.id ? (
            <li key={card.id} className="py-4">
              <CardForm
                initial={card}
                onCancel={() => setEditingId(null)}
                onSubmit={(input) => {
                  updateCard(card.id, input)
                  setEditingId(null)
                }}
              />
            </li>
          ) : (
            <li key={card.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">
                  {card.word} <span className="font-normal text-zinc-500 dark:text-zinc-400">- {card.meaning}</span>
                </p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">{card.exampleSentence}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(card.id)}
                  className="rounded-md px-3 py-1 text-sm text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => deleteCard(card.id)}
                  className="rounded-md px-3 py-1 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                >
                  삭제
                </button>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
