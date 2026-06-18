import { useState } from 'react'
import { useExpensesByMonth } from '../hooks/useExpenses'
import { formatMoney, formatDate, getCurrentYearMonth } from '../utils'
import MonthNavigator from '../components/MonthNavigator'
import ExpenseItem from '../components/ExpenseItem'
import type { Expense } from '../types'

type FilterType = 'all' | 'variable' | 'fixed' | 'saving'

export default function History() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth())
  const [filter, setFilter] = useState<FilterType>('all')
  const expenses = useExpensesByMonth(yearMonth)

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'variable', label: '변동지출' },
    { id: 'fixed', label: '고정지출' },
    { id: 'saving', label: '저축/투자' },
  ]

  const filtered = expenses.filter(e => {
    if (e.isNoSpend) return filter === 'all'
    return filter === 'all' || e.type === filter
  })

  // 날짜별 그룹화
  const grouped: Record<string, Expense[]> = {}
  for (const e of [...filtered].reverse()) {
    if (!grouped[e.date]) grouped[e.date] = []
    grouped[e.date].push(e)
  }

  const totalAmount = filtered
    .filter(e => !e.isNoSpend && e.type !== 'saving')
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="pb-24 md:pb-10">
      <div className="bg-white border-b border-slate-100 px-4 pt-6 pb-4 sticky top-0 z-10 md:pt-8">
        <div className="flex items-center justify-between mb-4">
          <MonthNavigator yearMonth={yearMonth} onChange={setYearMonth} />
          <span className="font-bold text-slate-800">{formatMoney(totalAmount)}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-5xl mb-4">📋</p>
            <p className="font-medium">내역이 없습니다</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, dayExpenses]) => {
            const dayTotal = dayExpenses
              .filter(e => !e.isNoSpend && e.type !== 'saving')
              .reduce((sum, e) => sum + e.amount, 0)

            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-500">{formatDate(date)}</span>
                  {dayTotal > 0 && (
                    <span className="text-sm font-bold text-slate-700">{formatMoney(dayTotal)}</span>
                  )}
                </div>
                <div className="space-y-2">
                  {dayExpenses.map(e => (
                    <ExpenseItem key={e.id} expense={e} />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
