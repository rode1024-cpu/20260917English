import { useRef, useState } from 'react'
import { useCardStore } from '../../store/useCardStore'

export function DataIO() {
  const exportData = useCardStore((state) => state.exportData)
  const importData = useCardStore((state) => state.importData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vocaloop-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (file: File) => {
    const text = await file.text()
    const result = importData(text)
    setMessage(result.success ? '가져오기가 완료되었습니다.' : `가져오기 실패: ${result.error}`)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="pb-6">
        <h3 className="font-medium">학습 데이터 내보내기</h3>
        <p className="mb-4 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          모든 단어 카드와 학습 기록을 JSON 파일로 저장합니다.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-blue-950 hover:bg-yellow-300"
        >
          내보내기 (Export)
        </button>
      </div>

      <div className="pt-6">
        <h3 className="font-medium">학습 데이터 가져오기</h3>
        <p className="mb-4 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          내보낸 JSON 파일을 불러오면 현재 데이터를 덮어씁니다.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleImportFile(file)
            e.target.value = ''
          }}
          className="text-sm text-zinc-500 dark:text-zinc-400"
        />
        {message && <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>}
      </div>
    </div>
  )
}
