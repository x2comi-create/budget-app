import { useState } from 'react'
import { X } from 'lucide-react'
import { PARENT_GROUPS } from '../categories'
import { useAllCategories } from '../hooks/useCategories'
import { usePaymentMethods } from '../hooks/usePaymentMethods'
import { addExpense } from '../hooks/useExpenses'
import { getToday } from '../utils'
import type { ExpenseType } from '../types'

interface Props {
  onClose: () => void
  defaultDate?: string
}

export default function ExpenseForm({ onClose, defaultDate }: Props) {
  const today = defaultDate ?? getToday()
  const [date, setDate] = useState(today)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('cash')
  const [memo, setMemo] = useState('')
  const [isNoSpend, setIsNoSpend] = useState(false)
  const [type, setType] = useState<ExpenseType>('variable')

  const allCategories = useAllCategories()
  const paymentMethods = usePaymentMethods()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isNoSpend) {
      await addExpense({
        date, amount: 0, categoryId: 'etc', description: '무지출',
        paymentMethodId: 'cash', type: 'variable', isNoSpend: true,
      })
      onClose()
      return
    }
    if (!amount || !categoryId || !description) return
    await addExpense({
      date, amount: parseInt(amount.replace(/,/g, '')), categoryId,
      description, paymentMethodId, type, memo,
    })
    onClose()
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setAmount(raw ? parseInt(raw).toLocaleString('ko-KR') : '')
  }

  const typeGroups = [
    { type: 'variable' as ExpenseType, label: '변동지출' },
    { type: 'fixed' as ExpenseType, label: '고정지출' },
    { type: 'saving' as ExpenseType, label: '저축/투자' },
  ]

  const filteredGroups = PARENT_GROUPS.filter(g => {
    if (type === 'saving') return g.id === 'saving'
    if (type === 'fixed') return ['fixed-home', 'fixed-transport'].includes(g.id)
    return !['saving', 'fixed-home', 'fixed-transport'].includes(g.id)
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">지출 입력</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 무지출 */}
          <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-indigo-200 transition-colors">
            <input type="checkbox" checked={isNoSpend} onChange={e => setIsNoSpend(e.target.checked)}
              className="w-5 h-5 accent-indigo-500" />
            <span className="font-medium text-slate-700">🙅 오늘 무지출</span>
          </label>

          {!isNoSpend && (
            <>
              {/* 날짜 */}
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">날짜</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 text-slate-800" />
              </div>

              {/* 금액 */}
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">금액</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" value={amount} onChange={handleAmountChange}
                    placeholder="0" required={!isNoSpend}
                    className="w-full px-3 py-2.5 pr-8 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 text-slate-800 text-xl font-bold" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">원</span>
                </div>
              </div>

              {/* 내용 */}
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">내용</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="무엇을 샀나요?" required={!isNoSpend}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 text-slate-800" />
              </div>

              {/* 지출 유형 */}
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">지출 유형</label>
                <div className="flex gap-2">
                  {typeGroups.map(tg => (
                    <button key={tg.type} type="button"
                      onClick={() => { setType(tg.type); setCategoryId('') }}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        type === tg.type ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >{tg.label}</button>
                  ))}
                </div>
              </div>

              {/* 카테고리 */}
              <div>
                <label className="text-sm font-medium text-slate-500 mb-2 block">카테고리</label>
                <div className="space-y-2">
                  {filteredGroups.map(group => {
                    const cats = allCategories.filter(c => c.parent === group.id)
                    if (cats.length === 0) return null
                    return (
                      <div key={group.id}>
                        <p className="text-xs font-medium text-slate-400 mb-1">{group.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {cats.map(cat => (
                            <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border-2 ${
                                categoryId === cat.id ? 'border-transparent text-white' : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                              }`}
                              style={categoryId === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                            >
                              <span>{cat.icon}</span>{cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 결제 수단 */}
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">결제 수단</label>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map(pm => (
                    <button key={pm.id} type="button" onClick={() => setPaymentMethodId(pm.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border-2 ${
                        paymentMethodId === pm.id ? 'text-white border-transparent' : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                      }`}
                      style={paymentMethodId === pm.id ? { backgroundColor: pm.color, borderColor: pm.color } : {}}
                    >{pm.name}</button>
                  ))}
                </div>
              </div>

              {/* 메모 */}
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">메모 (선택)</label>
                <input type="text" value={memo} onChange={e => setMemo(e.target.value)}
                  placeholder="추가 메모"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 text-slate-800" />
              </div>
            </>
          )}

          <button type="submit"
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition-colors">
            {isNoSpend ? '무지출 기록' : '저장'}
          </button>
        </form>
      </div>
    </div>
  )
}
