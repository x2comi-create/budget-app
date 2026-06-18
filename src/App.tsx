import { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import SideNav from './components/SideNav'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Budget from './pages/Budget'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'

type Tab = 'home' | 'history' | 'budget' | 'stats' | 'settings'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <ErrorBoundary>
    <div className="min-h-svh bg-slate-50 flex">
      <SideNav active={tab} onChange={setTab} />
      <main className="flex-1 md:ml-56 min-h-svh">
        <div className="md:max-w-3xl md:mx-auto">
          {tab === 'home'     && <Dashboard />}
          {tab === 'history'  && <History />}
          {tab === 'budget'   && <Budget />}
          {tab === 'stats'    && <Statistics />}
          {tab === 'settings' && <Settings />}
        </div>
      </main>
      <div className="md:hidden">
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </div>
    </ErrorBoundary>
  )
}
