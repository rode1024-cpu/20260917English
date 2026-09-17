/** yyyy-MM-dd 형식의 로컬 날짜 문자열로 변환한다 (UTC 변환으로 인한 날짜 밀림 방지) */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

/** a가 b보다 같거나 이전 날짜인지 (yyyy-MM-dd 문자열은 사전식 비교가 곧 날짜 비교) */
export function isOnOrBefore(a: string, b: string): boolean {
  return a <= b
}

/** 오늘로부터 과거 n일치 날짜 키를 오래된 순으로 반환 (n=7 -> 6일 전 ~ 오늘) */
export function lastNDays(n: number): string[] {
  const today = todayKey()
  const days: string[] = []
  for (let i = n - 1; i >= 0; i -= 1) {
    days.push(addDays(today, -i))
  }
  return days
}
