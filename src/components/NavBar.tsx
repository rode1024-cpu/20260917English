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
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
        <span className="text-base font-semibold tracking-tight">VocaLoop</span>
        <nav className="flex flex-1 items-center gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`shrink-0 border-b-2 py-1 text-sm transition-colors ${
                active === tab.key
                  ? 'border-zinc-900 font-medium text-zinc-900 dark:border-zinc-100 dark:text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300'
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
          className="shrink-0 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
