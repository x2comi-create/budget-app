import { useState, useEffect } from 'react'
import { initDefaults } from './db'
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

  useEffect(() => {
    initDefaults()
  }, [])

  return (
    <div className="min-h-svh bg-slate-50 flex">
      {/* 데스크톱 사이드바 (md 이상) */}
      <SideNav active={tab} onChange={setTab} />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 md:ml-56 min-h-svh">
        {/* 모바일: 단일 컬럼 / 데스크톱: 중앙 정렬 */}
        <div className="md:max-w-3xl md:mx-auto">
          {tab === 'home'     && <Dashboard />}
          {tab === 'history'  && <History />}
          {tab === 'budget'   && <Budget />}
          {tab === 'stats'    && <Statistics />}
          {tab === 'settings' && <Settings />}
        </div>
      </main>

      {/* 모바일 하단 탭바 (md 미만) */}
      <div className="md:hidden">
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </div>
  )
}
