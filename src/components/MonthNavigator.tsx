import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatYearMonth, getPrevMonth, getNextMonth, getCurrentYearMonth } from '../utils'

interface Props {
  yearMonth: string
  onChange: (ym: string) => void
}

export default function MonthNavigator({ yearMonth, onChange }: Props) {
  const isCurrentMonth = yearMonth === getCurrentYearMonth()

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(getPrevMonth(yearMonth))}
        className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <ChevronLeft size={20} className="text-slate-500" />
      </button>
      <span className="font-bold text-slate-800 text-lg min-w-[120px] text-center">
        {formatYearMonth(yearMonth)}
      </span>
      <button
        onClick={() => onChange(getNextMonth(yearMonth))}
        disabled={isCurrentMonth}
        className="p-2 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-30"
      >
        <ChevronRight size={20} className="text-slate-500" />
      </button>
    </div>
  )
}
