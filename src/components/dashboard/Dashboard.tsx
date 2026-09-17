import { useCardStore } from '../../store/useCardStore'
import { WeeklyBarChart } from './WeeklyBarChart'

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 px-6 py-2 first:pl-0">
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
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
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <div className="grid grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800">
        <StatTile label="오늘 학습한 카드" value={todayCount} />
        <StatTile label="전체 단어 수" value={cards.length} />
        <StatTile label="복습 예정 카드" value={dueCount} />
      </div>

      <WeeklyBarChart data={weeklyLog} />
    </div>
  )
}
