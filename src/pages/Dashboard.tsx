import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useExpensesByMonth } from '../hooks/useExpenses'
import { useBudgets } from '../hooks/useBudgets'
import { PARENT_GROUPS } from '../categories'
import { useAllCategories } from '../hooks/useCategories'
import { formatMoney, formatMoneyShort, getCurrentYearMonth, formatYearMonth } from '../utils'
import MonthNavigator from '../components/MonthNavigator'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseItem from '../components/ExpenseItem'

export default function Dashboard() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth())
  const [showForm, setShowForm] = useState(false)
  const expenses = useExpensesByMonth(yearMonth)
  const budgets = useBudgets(yearMonth)
  const allCategories = useAllCategories()

  const realExpenses = expenses.filter(e => !e.isNoSpend)
  const noSpendDays = expenses.filter(e => e.isNoSpend).length

  const totalExpense = realExpenses
    .filter(e => e.type !== 'saving')
    .reduce((sum, e) => sum + e.amount, 0)
  const totalSaving = realExpenses
    .filter(e => e.type === 'saving')
    .reduce((sum, e) => sum + e.amount, 0)
  const totalFixed = realExpenses
    .filter(e => e.type === 'fixed')
    .reduce((sum, e) => sum + e.amount, 0)
  const totalVariable = realExpenses
    .filter(e => e.type === 'variable')
    .reduce((sum, e) => sum + e.amount, 0)

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const budgetUsedPct = totalBudget > 0 ? Math.min((totalExpense / totalBudget) * 100, 100) : 0

  // 카테고리별 집계
  const categoryTotals: Record<string, number> = {}
  realExpenses.filter(e => e.type !== 'saving').forEach(e => {
    categoryTotals[e.categoryId] = (categoryTotals[e.categoryId] ?? 0) + e.amount
  })

  // 부모 그룹별 집계 (파이차트용)
  const groupTotals = PARENT_GROUPS
    .filter(g => g.id !== 'saving')
    .map(group => {
      const cats = Object.entries(categoryTotals)
        .filter(([catId]) => allCategories.find(c => c.id === catId)?.parent === group.id)
        .reduce((sum, [, amt]) => sum + amt, 0)
      return { name: group.name, value: cats, color: group.color }
    })
    .filter(g => g.value > 0)

  // 최근 내역 (최대 10건)
  const recentExpenses = [...expenses].reverse().slice(0, 10)

  const today = new Date().toISOString().slice(0, 10)
  const todayExpenses = realExpenses.filter(e => e.date === today && e.type !== 'saving')
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0)

  const isCurrentMonth = yearMonth === getCurrentYearMonth()

  return (
    <div className="pb-24 md:pb-10">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-4 pt-6 pb-8 md:pt-8">
        <div className="flex items-center justify-between mb-6">
          <MonthNavigator yearMonth={yearMonth} onChange={setYearMonth} />
          {isCurrentMonth && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors"
            >
              <Plus size={18} />
              입력
            </button>
          )}
        </div>

        <div className="text-white">
          <p className="text-sm opacity-80">{formatYearMonth(yearMonth)} 총 지출</p>
          <p className="text-4xl font-bold mt-1">{formatMoneyShort(totalExpense)}</p>
          {totalBudget > 0 && (
            <p className="text-sm opacity-80 mt-1">
              예산 {formatMoneyShort(totalBudget)} 중 {budgetUsedPct.toFixed(0)}% 사용
            </p>
          )}
        </div>

        {totalBudget > 0 && (
          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${budgetUsedPct >= 90 ? 'bg-red-300' : budgetUsedPct >= 70 ? 'bg-yellow-300' : 'bg-white'}`}
              style={{ width: `${budgetUsedPct}%` }}
            />
          </div>
        )}
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-blue-500 mb-2">
              <TrendingDown size={16} />
              <span className="text-xs font-medium">고정지출</span>
            </div>
            <p className="font-bold text-slate-800">{formatMoneyShort(totalFixed)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-orange-500 mb-2">
              <Wallet size={16} />
              <span className="text-xs font-medium">변동지출</span>
            </div>
            <p className="font-bold text-slate-800">{formatMoneyShort(totalVariable)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-1 text-purple-500 mb-2">
              <TrendingUp size={16} />
              <span className="text-xs font-medium">저축/투자</span>
            </div>
            <p className="font-bold text-slate-800">{formatMoneyShort(totalSaving)}</p>
          </div>
        </div>

        {/* 오늘 지출 (현재 월만) */}
        {isCurrentMonth && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-indigo-500" />
                <span className="font-semibold text-slate-700">오늘 지출</span>
              </div>
              <span className="font-bold text-slate-800">{formatMoney(todayTotal)}</span>
            </div>
            {noSpendDays > 0 && (
              <div className="mb-3 px-3 py-2 bg-emerald-50 rounded-xl text-sm text-emerald-700 font-medium">
                🙅 이번 달 무지출 {noSpendDays}일
              </div>
            )}
            {todayExpenses.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-2">오늘 지출 내역이 없습니다</p>
            ) : (
              <div className="space-y-2">
                {todayExpenses.slice(0, 3).map(e => (
                  <ExpenseItem key={e.id} expense={e} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 지출 분포 파이차트 */}
        {groupTotals.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-3">카테고리별 지출</h3>
            <div className="flex items-center gap-4">
              <div className="h-36 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={groupTotals} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {groupTotals.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatMoney(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 flex-1">
                {groupTotals.slice(0, 6).map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                    <span className="text-xs text-slate-600 flex-1 truncate">{g.name}</span>
                    <span className="text-xs font-semibold text-slate-700">{formatMoneyShort(g.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 최근 내역 */}
        {recentExpenses.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-3">최근 내역</h3>
            <div className="space-y-2">
              {recentExpenses.map(e => (
                <ExpenseItem key={e.id} expense={e} showDate />
              ))}
            </div>
          </div>
        )}

        {recentExpenses.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-5xl mb-4">📒</p>
            <p className="font-medium">아직 지출 내역이 없어요</p>
            <p className="text-sm mt-1">+ 입력 버튼으로 첫 지출을 기록해보세요</p>
          </div>
        )}
      </div>

      {showForm && <ExpenseForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
