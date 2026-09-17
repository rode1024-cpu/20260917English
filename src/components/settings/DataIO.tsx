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
    <div className="mx-auto flex max-w-md flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
      <div>
        <h3 className="font-semibold">학습 데이터 내보내기</h3>
        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
          모든 단어 카드와 학습 기록을 JSON 파일로 저장합니다.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700"
        >
          내보내기 (Export)
        </button>
      </div>

      <div>
        <h3 className="font-semibold">학습 데이터 가져오기</h3>
        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
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
          className="text-sm"
        />
        {message && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>}
      </div>
    </div>
  )
}
