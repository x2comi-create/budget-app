import { useState } from 'react'
import { Check } from 'lucide-react'
import { useExpensesByMonth } from '../hooks/useExpenses'
import { useBudgets, setBudget } from '../hooks/useBudgets'
import { useAllCategories } from '../hooks/useCategories'
import { PARENT_GROUPS } from '../categories'
import { formatMoneyShort, getCurrentYearMonth, formatYearMonth } from '../utils'
import MonthNavigator from '../components/MonthNavigator'

export default function Budget() {
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  const expenses = useExpensesByMonth(yearMonth)
  const budgets = useBudgets(yearMonth)
  const allCategories = useAllCategories()

  const realExpenses = expenses.filter(e => !e.isNoSpend)

  const getBudgetAmount = (catId: string) =>
    budgets.find(b => b.categoryId === catId)?.amount ?? 0

  const getSpentAmount = (catId: string) =>
    realExpenses.filter(e => e.categoryId === catId).reduce((sum, e) => sum + e.amount, 0)

  const getGroupBudget = (groupId: string) =>
    allCategories.filter(c => c.parent === groupId).reduce((sum, c) => sum + getBudgetAmount(c.id), 0)

  const getGroupSpent = (groupId: string) =>
    allCategories.filter(c => c.parent === groupId).reduce((sum, c) => sum + getSpentAmount(c.id), 0)

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = realExpenses.filter(e => e.type !== 'saving').reduce((sum, e) => sum + e.amount, 0)

  async function handleSave(catId: string) {
    const amount = parseInt(inputValue.replace(/,/g, '')) || 0
    await setBudget(yearMonth, catId, amount)
    setEditingId(null)
    setInputValue('')
  }

  function startEdit(catId: string) {
    const current = getBudgetAmount(catId)
    setEditingId(catId)
    setInputValue(current > 0 ? current.toLocaleString('ko-KR') : '')
  }

  return (
    <div className="pb-24 md:pb-10">
      <div className="bg-white border-b border-slate-100 px-4 pt-6 pb-4 sticky top-0 z-10 md:pt-8">
        <MonthNavigator yearMonth={yearMonth} onChange={setYearMonth} />
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl">
        {/* 전체 요약 */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-sm opacity-80 mb-1">{formatYearMonth(yearMonth)} 예산 현황</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">{formatMoneyShort(totalSpent)}</p>
              <p className="text-sm opacity-80 mt-1">예산 {formatMoneyShort(totalBudget)} 중</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}%` : '-'}
              </p>
              <p className="text-sm opacity-80">사용</p>
            </div>
          </div>
          {totalBudget > 0 && (
            <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }} />
            </div>
          )}
        </div>

        {/* 그룹별 예산 */}
        {PARENT_GROUPS.map(group => {
          const cats = allCategories.filter(c => c.parent === group.id)
          if (cats.length === 0) return null
          const groupBudget = getGroupBudget(group.id)
          const groupSpent = getGroupSpent(group.id)
          const pct = groupBudget > 0 ? Math.min((groupSpent / groupBudget) * 100, 100) : 0

          return (
            <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{group.icon}</span>
                    <span className="font-semibold text-slate-700">{group.name}</span>
                  </div>
                  <div className="text-right text-sm">
                    <span className="font-bold text-slate-800">{formatMoneyShort(groupSpent)}</span>
                    {groupBudget > 0 && <span className="text-slate-400"> / {formatMoneyShort(groupBudget)}</span>}
                  </div>
                </div>
                {groupBudget > 0 && (
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : group.color }} />
                  </div>
                )}
              </div>

              <div className="divide-y divide-slate-50">
                {cats.map(cat => {
                  const catBudget = getBudgetAmount(cat.id)
                  const catSpent = getSpentAmount(cat.id)
                  const catPct = catBudget > 0 ? Math.min((catSpent / catBudget) * 100, 100) : 0
                  const isEditing = editingId === cat.id

                  return (
                    <div key={cat.id} className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ backgroundColor: cat.color + '20' }}>
                          {cat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800">{formatMoneyShort(catSpent)}</span>
                              {catBudget > 0 && !isEditing && (
                                <span className="text-xs text-slate-400">/ {formatMoneyShort(catBudget)}</span>
                              )}
                            </div>
                          </div>
                          {isEditing ? (
                            <div className="flex items-center gap-2 mt-2">
                              <input type="text" inputMode="numeric" value={inputValue} autoFocus
                                onChange={e => {
                                  const raw = e.target.value.replace(/[^0-9]/g, '')
                                  setInputValue(raw ? parseInt(raw).toLocaleString('ko-KR') : '')
                                }}
                                placeholder="예산 입력 (원)"
                                className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-indigo-300 focus:outline-none focus:border-indigo-500"
                              />
                              <button onClick={() => handleSave(cat.id)}
                                className="p-1.5 bg-indigo-500 text-white rounded-lg">
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between mt-1">
                              {catBudget > 0 ? (
                                <div className="flex-1 mr-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all"
                                    style={{ width: `${catPct}%`, backgroundColor: catPct >= 90 ? '#ef4444' : cat.color }} />
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 flex-1">예산 미설정</span>
                              )}
                              <button onClick={() => startEdit(cat.id)}
                                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium whitespace-nowrap ml-2">
                                {catBudget > 0 ? '수정' : '설정'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
