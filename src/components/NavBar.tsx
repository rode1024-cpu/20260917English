import { useTheme } from '../hooks/useTheme'

export type ViewKey = 'dashboard' | 'study' | 'quiz' | 'curriculum' | 'manage' | 'settings'

const TABS: { key: ViewKey; label: string }[] = [
  { key: 'dashboard', label: '대시보드' },
  { key: 'study', label: '학습' },
  { key: 'quiz', label: '퀴즈' },
  { key: 'curriculum', label: 'AI 커리큘럼' },
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
    <header className="bg-blue-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
        <span className="text-base font-semibold tracking-tight text-white">VocaLoop</span>
        <nav className="flex flex-1 items-center gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`shrink-0 border-b-2 py-1 text-sm transition-colors ${
                active === tab.key
                  ? 'border-yellow-400 font-medium text-white'
                  : 'border-transparent text-blue-300 hover:text-white'
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
          className="shrink-0 rounded-md p-1.5 text-blue-300 hover:bg-blue-900 hover:text-white"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
