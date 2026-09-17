import { useEffect, useState } from 'react'
import { NavBar, type ViewKey } from './components/NavBar'
import { Dashboard } from './components/dashboard/Dashboard'
import { StudyView } from './components/study/StudyView'
import { QuizView } from './components/quiz/QuizView'
import { CardManager } from './components/manage/CardManager'
import { DataIO } from './components/settings/DataIO'
import { useCardStore } from './store/useCardStore'

export default function App() {
  const initialize = useCardStore((state) => state.initialize)
  const [view, setView] = useState<ViewKey>('dashboard')

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="min-h-full">
      <NavBar active={view} onChange={setView} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {view === 'dashboard' && <Dashboard />}
        {view === 'study' && <StudyView />}
        {view === 'quiz' && <QuizView />}
        {view === 'manage' && <CardManager />}
        {view === 'settings' && <DataIO />}
      </main>
    </div>
  )
}
