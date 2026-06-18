import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useExpensesByMonth } from '../hooks/useExpenses'
import { useAllCategories } from '../hooks/useCategories'
import { formatMoney, formatMoneyShort, getCurrentYearMonth, getWeekOfMonth } from '../utils'
import MonthNavigator from '../components/MonthNavigator'
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function tooltipFormatter(v: unknown): string {
  return typeof v === 'number' ? formatMoney(v) : String(v)
}

export default function Statistics() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth())
  const expenses = useExpensesByMonth(yearMonth)
  const allCategories = useAllCategories()
  const realExpenses = expenses.filter(e => !e.isNoSpend && e.type !== 'saving')

  // 카테고리별 집계
  const categoryTotals: Record<string, number> = {}
  for (const e of realExpenses) {
    categoryTotals[e.categoryId] = (categoryTotals[e.categoryId] ?? 0) + e.amount
  }

  const sortedCats = Object.entries(categoryTotals)
    .map(([id, amount]) => ({ cat: allCategories.find(c => c.id === id), amount }))
    .filter(x => x.cat)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)

  // 요일별 집계
  const weekdayTotals: number[] = [0, 0, 0, 0, 0, 0, 0]
  for (const e of realExpenses) {
    const day = new Date(e.date).getDay()
    weekdayTotals[day] += e.amount
  }
  const weekdayData = WEEKDAYS.map((name, i) => ({ name, amount: weekdayTotals[i] }))
  const maxWeekday = Math.max(...weekdayTotals)

  // 주차별 집계
  const weekTotals: Record<number, number> = {}
  for (const e of realExpenses) {
    const w = getWeekOfMonth(e.date)
    weekTotals[w] = (weekTotals[w] ?? 0) + e.amount
  }
  const weekData = Object.entries(weekTotals)
    .map(([w, amount]) => ({ name: `${w}주`, amount }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name))

  const totalSpent = realExpenses.reduce((sum, e) => sum + e.amount, 0)
  const noSpendDays = expenses.filter(e => e.isNoSpend).length
  const currentDay = yearMonth === getCurrentYearMonth() ? new Date().getDate() : 30
  const avgPerDay = totalSpent > 0 ? Math.round(totalSpent / currentDay) : 0

  return (
    <div className="pb-24 md:pb-10">
      <div className="bg-white border-b border-slate-100 px-4 pt-6 pb-4 sticky top-0 z-10 md:pt-8">
        <MonthNavigator yearMonth={yearMonth} onChange={setYearMonth} />
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl">
        {/* 요약 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-1">총 지출</p>
            <p className="font-bold text-slate-800 text-sm">{formatMoneyShort(totalSpent)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-1">일 평균</p>
            <p className="font-bold text-slate-800 text-sm">{formatMoneyShort(avgPerDay)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-1">무지출일</p>
            <p className="font-bold text-emerald-600 text-sm">{noSpendDays}일</p>
          </div>
        </div>

        {/* 카테고리 TOP */}
        {sortedCats.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-4">카테고리별 지출 TOP</h3>
            <div className="space-y-3">
              {sortedCats.map(({ cat, amount }) => {
                const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0
                return (
                  <div key={cat!.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{cat!.icon}</span>
                      <span className="text-sm text-slate-700 flex-1">{cat!.name}</span>
                      <span className="text-sm font-bold text-slate-800">{formatMoneyShort(amount)}</span>
                      <span className="text-xs text-slate-400 w-10 text-right">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: cat!.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 주차별 지출 */}
        {weekData.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-4">주차별 지출</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => formatMoneyShort(Number(v))} width={55} />
                  <Tooltip formatter={tooltipFormatter} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 요일별 지출 */}
        {totalSpent > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-4">요일별 지출 패턴</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => formatMoneyShort(Number(v))} width={55} />
                  <Tooltip formatter={tooltipFormatter} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {weekdayData.map((entry, i) => (
                      <Cell key={i} fill={entry.amount === maxWeekday && maxWeekday > 0 ? '#6366f1' : '#c7d2fe'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {realExpenses.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-5xl mb-4">📊</p>
            <p className="font-medium">데이터가 없습니다</p>
            <p className="text-sm mt-1">지출을 기록하면 통계를 볼 수 있어요</p>
          </div>
        )}
      </div>
    </div>
  )
}
