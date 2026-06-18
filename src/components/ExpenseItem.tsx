import { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useAllCategories } from '../hooks/useCategories'
import { usePaymentMethods } from '../hooks/usePaymentMethods'
import { deleteExpense } from '../hooks/useExpenses'
import { formatMoney, formatDate } from '../utils'
import type { Expense } from '../types'

interface Props {
  expense: Expense
  showDate?: boolean
}

export default function ExpenseItem({ expense, showDate = false }: Props) {
  const [expanded, setExpanded] = useState(false)
  const allCategories = useAllCategories()
  const category = allCategories.find(c => c.id === expense.categoryId)
  const paymentMethods = usePaymentMethods()
  const pm = paymentMethods.find(p => p.id === expense.paymentMethodId)

  if (expense.isNoSpend) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <span className="text-2xl">🙅</span>
        <div className="flex-1">
          {showDate && <p className="text-xs text-slate-400 mb-0.5">{formatDate(expense.date)}</p>}
          <p className="font-medium text-emerald-700">무지출의 날</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: (category?.color ?? '#6b7280') + '20' }}>
          {category?.icon ?? '📦'}
        </div>
        <div className="flex-1 min-w-0">
          {showDate && <p className="text-xs text-slate-400 mb-0.5">{formatDate(expense.date)}</p>}
          <p className="font-medium text-slate-800 truncate">{expense.description}</p>
          <p className="text-xs text-slate-400">{category?.name ?? '기타'}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-slate-800">{formatMoney(expense.amount)}</p>
          {pm && (
            <span className="text-xs px-1.5 py-0.5 rounded-md font-medium"
              style={{ backgroundColor: pm.color + '20', color: pm.color }}>
              {pm.name}
            </span>
          )}
        </div>
        {expanded
          ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
          : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-3 border-t border-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {expense.memo && <p className="mt-2">💬 {expense.memo}</p>}
            <p className="mt-2 text-xs">
              유형: {expense.type === 'fixed' ? '고정지출' : expense.type === 'saving' ? '저축' : '변동지출'}
            </p>
          </div>
          <button onClick={() => expense.id && deleteExpense(expense.id)}
            className="mt-2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
