import { useCardStore } from '../../store/useCardStore'
import { WeeklyBarChart } from './WeeklyBarChart'

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-800">
      <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

export function Dashboard() {
  const cards = useCardStore((state) => state.cards)
  const getDueCards = useCardStore((state) => state.getDueCards)
  const getTodayStudiedCount = useCardStore((state) => state.getTodayStudiedCount)
  const getLast7DaysLog = useCardStore((state) => state.getLast7DaysLog)

  const dueCount = getDueCards().length
  const todayCount = getTodayStudiedCount()
  const weeklyLog = getLast7DaysLog()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <StatTile label="오늘 학습한 카드" value={todayCount} />
        <StatTile label="전체 단어 수" value={cards.length} />
        <StatTile label="복습 예정 카드" value={dueCount} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
        <WeeklyBarChart data={weeklyLog} />
      </div>
    </div>
  )
}
