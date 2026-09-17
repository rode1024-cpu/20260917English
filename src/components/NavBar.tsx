import { useTheme } from '../hooks/useTheme'

export type ViewKey = 'dashboard' | 'study' | 'quiz' | 'manage' | 'settings'

const TABS: { key: ViewKey; label: string }[] = [
  { key: 'dashboard', label: '대시보드' },
  { key: 'study', label: '학습' },
  { key: 'quiz', label: '퀴즈' },
  { key: 'manage', label: '단어 관리' },
  { key: 'settings', label: '설정' },
]

interface NavBarProps {
  active: ViewKey
  onChange: (view: ViewKey) => void
}

export function NavBar({ active, onChange }: NavBarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-3">
        <span className="text-lg font-bold text-sky-600 dark:text-sky-400">VocaLoop</span>
        <nav className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active === tab.key
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="다크모드 전환"
          className="rounded-md border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
