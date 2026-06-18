import { Home, List, PieChart, BarChart2, Settings } from 'lucide-react'

type Tab = 'home' | 'history' | 'budget' | 'stats' | 'settings'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'home', label: '홈', Icon: Home },
  { id: 'history', label: '내역', Icon: List },
  { id: 'budget', label: '예산', Icon: PieChart },
  { id: 'stats', label: '통계', Icon: BarChart2 },
  { id: 'settings', label: '설정', Icon: Settings },
]

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-40 safe-area-bottom">
      <div className="max-w-md mx-auto flex">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              active === id ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon size={22} strokeWidth={active === id ? 2.5 : 1.5} />
            <span className={`text-[10px] font-medium ${active === id ? 'text-indigo-500' : 'text-slate-400'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}
