import type { StudyLogEntry } from '../../types/card'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function formatDayLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return WEEKDAY_LABELS[date.getDay()]
}

interface WeeklyBarChartProps {
  data: StudyLogEntry[]
}

/** 최근 7일 학습량을 보여주는 단일 시리즈 막대 그래프. 항목이 하나뿐이라 범례는 생략한다. */
export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const maxCount = Math.max(1, ...data.map((d) => d.count))

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">최근 7일 학습량</h3>
      <div className="flex h-40 items-end justify-between gap-2">
        {data.map((entry) => {
          const heightPct = (entry.count / maxCount) * 100
          return (
            <div key={entry.date} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">{entry.count || ''}</span>
              <div className="flex h-28 w-full items-end">
                <div
                  className="w-full rounded-t-sm bg-sky-500 transition-[height] dark:bg-sky-400"
                  style={{ height: `${entry.count > 0 ? Math.max(heightPct, 6) : 2}%` }}
                  title={`${entry.date}: ${entry.count}개`}
                />
              </div>
              <span className="text-xs text-slate-400">{formatDayLabel(entry.date)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
