import { Home, List, PieChart, BarChart2, Settings, BookOpen } from 'lucide-react'

type Tab = 'home' | 'history' | 'budget' | 'stats' | 'settings'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; Icon: React.ElementType; desc: string }[] = [
  { id: 'home',     label: '홈',   Icon: Home,     desc: '이번 달 요약' },
  { id: 'history',  label: '내역', Icon: List,     desc: '지출 내역 조회' },
  { id: 'budget',   label: '예산', Icon: PieChart,  desc: '카테고리별 예산' },
  { id: 'stats',    label: '통계', Icon: BarChart2, desc: '지출 분석' },
  { id: 'settings', label: '설정', Icon: Settings,  desc: '카드·카테고리 관리' },
]

export default function SideNav({ active, onChange }: Props) {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-white border-r border-slate-100 z-30">
      {/* 로고 */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        <span className="font-bold text-slate-800 text-lg">가계부</span>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {TABS.map(({ id, label, Icon, desc }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              active === id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Icon size={18} strokeWidth={active === id ? 2.5 : 1.8} />
            <div>
              <p className={`text-sm font-medium leading-tight ${active === id ? 'text-indigo-600' : 'text-slate-700'}`}>
                {label}
              </p>
              <p className="text-xs text-slate-400 leading-tight mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </nav>

      {/* 하단 */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">v1.0.0 · 로컬 저장</p>
      </div>
    </aside>
  )
}
