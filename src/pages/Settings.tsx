import { useState } from 'react'
import { Plus, Trash2, Check, Lock } from 'lucide-react'
import { usePaymentMethods, addPaymentMethod, deletePaymentMethod } from '../hooks/usePaymentMethods'
import { useAllCategories, addCustomCategory, deleteCustomCategory, typeFromParent } from '../hooks/useCategories'
import { CATEGORIES, PARENT_GROUPS } from '../categories'
import type { PaymentMethod } from '../types'

const CARD_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#ec4899', '#6b7280', '#0f172a',
]

const PM_TYPES: { id: PaymentMethod['type']; label: string }[] = [
  { id: 'cash', label: '현금' },
  { id: 'debit', label: '체크카드' },
  { id: 'credit', label: '신용카드' },
  { id: 'transfer', label: '계좌이체' },
]

const BUILTIN_IDS = new Set(CATEGORIES.map(c => c.id))

export default function Settings() {
  const paymentMethods = usePaymentMethods()
  const allCategories = useAllCategories()

  // 결제수단 추가 폼
  const [showAddPm, setShowAddPm] = useState(false)
  const [pmName, setPmName] = useState('')
  const [pmColor, setPmColor] = useState('#6366f1')
  const [pmType, setPmType] = useState<PaymentMethod['type']>('credit')

  // 카테고리 추가 폼
  const [showAddCat, setShowAddCat] = useState(false)
  const [catName, setCatName] = useState('')
  const [catIcon, setCatIcon] = useState('📦')
  const [catColor, setCatColor] = useState('#6366f1')
  const [catParent, setCatParent] = useState('food')

  // 삭제 확인
  const [confirmDeletePm, setConfirmDeletePm] = useState<string | null>(null)
  const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(null)

  async function handleAddPm() {
    if (!pmName.trim()) return
    const id = `pm-${Date.now()}`
    await addPaymentMethod({ id, name: pmName.trim(), color: pmColor, type: pmType })
    setPmName(''); setPmColor('#6366f1'); setPmType('credit'); setShowAddPm(false)
  }

  async function handleDeletePm(id: string) {
    if (paymentMethods.length <= 1) return
    await deletePaymentMethod(id)
    setConfirmDeletePm(null)
  }

  async function handleAddCat() {
    if (!catName.trim()) return
    await addCustomCategory({
      name: catName.trim(),
      icon: catIcon,
      color: catColor,
      parent: catParent,
      type: typeFromParent(catParent),
    })
    setCatName(''); setCatIcon('📦'); setCatColor('#6366f1'); setCatParent('food'); setShowAddCat(false)
  }

  async function handleDeleteCat(id: string) {
    await deleteCustomCategory(id)
    setConfirmDeleteCat(null)
  }

  return (
    <div className="pb-24 md:pb-10">
      <div className="bg-white border-b border-slate-100 px-4 pt-6 pb-4 md:pt-8">
        <h1 className="text-xl font-bold text-slate-800">설정</h1>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl">

        {/* ── 결제 수단 ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50">
            <h3 className="font-semibold text-slate-700">결제 수단</h3>
            <button
              onClick={() => setShowAddPm(v => !v)}
              className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700 font-medium"
            >
              <Plus size={16} /> 추가
            </button>
          </div>

          {showAddPm && (
            <div className="px-4 py-4 bg-slate-50 border-b border-slate-100 space-y-3">
              <input
                type="text"
                value={pmName}
                onChange={e => setPmName(e.target.value)}
                placeholder="카드/계좌 이름"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 text-sm"
              />
              <div className="flex gap-2">
                {PM_TYPES.map(t => (
                  <button key={t.id} onClick={() => setPmType(t.id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      pmType === t.id ? 'bg-indigo-500 text-white' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >{t.label}</button>
                ))}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">색상</p>
                <div className="flex flex-wrap gap-2">
                  {CARD_COLORS.map(c => (
                    <button key={c} onClick={() => setPmColor(c)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    >
                      {pmColor === c && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddPm}
                  className="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600">
                  추가
                </button>
                <button onClick={() => setShowAddPm(false)}
                  className="px-4 py-2.5 bg-slate-200 text-slate-600 rounded-xl text-sm font-medium">
                  취소
                </button>
              </div>
            </div>
          )}

          <div className="divide-y divide-slate-50">
            {paymentMethods.map(pm => (
              <div key={pm.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: pm.color }} />
                <div className="flex-1">
                  <p className="font-medium text-slate-700">{pm.name}</p>
                  <p className="text-xs text-slate-400">{PM_TYPES.find(t => t.id === pm.type)?.label}</p>
                </div>
                {confirmDeletePm === pm.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">삭제할까요?</span>
                    <button onClick={() => handleDeletePm(pm.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium">
                      삭제
                    </button>
                    <button onClick={() => setConfirmDeletePm(null)}
                      className="px-2 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-medium">
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeletePm(pm.id)}
                    disabled={paymentMethods.length <= 1}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-20"
                    title={paymentMethods.length <= 1 ? '최소 1개 이상 필요' : '삭제'}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 카테고리 관리 ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50">
            <h3 className="font-semibold text-slate-700">카테고리</h3>
            <button
              onClick={() => setShowAddCat(v => !v)}
              className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700 font-medium"
            >
              <Plus size={16} /> 추가
            </button>
          </div>

          {showAddCat && (
            <div className="px-4 py-4 bg-slate-50 border-b border-slate-100 space-y-3">
              <div className="flex gap-2">
                <div className="w-14">
                  <label className="text-xs text-slate-500 mb-1 block">아이콘</label>
                  <input
                    type="text"
                    value={catIcon}
                    onChange={e => setCatIcon(e.target.value)}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 text-center text-xl"
                    maxLength={2}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">이름</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    placeholder="카테고리 이름"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">그룹</label>
                <div className="flex flex-wrap gap-2">
                  {PARENT_GROUPS.map(g => (
                    <button key={g.id} onClick={() => setCatParent(g.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        catParent === g.id ? 'text-white border-transparent' : 'border-slate-200 text-slate-600 bg-white'
                      }`}
                      style={catParent === g.id ? { backgroundColor: g.color } : {}}
                    >
                      <span>{g.icon}</span>{g.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">색상</p>
                <div className="flex flex-wrap gap-2">
                  {CARD_COLORS.map(c => (
                    <button key={c} onClick={() => setCatColor(c)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    >
                      {catColor === c && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={handleAddCat}
                  className="flex-1 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600">
                  추가
                </button>
                <button onClick={() => setShowAddCat(false)}
                  className="px-4 py-2.5 bg-slate-200 text-slate-600 rounded-xl text-sm font-medium">
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 그룹별 카테고리 목록 */}
          <div className="divide-y divide-slate-50">
            {PARENT_GROUPS.map(group => {
              const cats = allCategories.filter(c => c.parent === group.id)
              if (cats.length === 0) return null
              return (
                <div key={group.id} className="px-4 py-3">
                  <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                    <span>{group.icon}</span>{group.name}
                  </p>
                  <div className="space-y-1.5">
                    {cats.map(cat => {
                      const isBuiltin = BUILTIN_IDS.has(cat.id)
                      return (
                        <div key={cat.id} className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                            style={{ backgroundColor: cat.color + '20' }}>
                            {cat.icon}
                          </div>
                          <span className="flex-1 text-sm text-slate-700">{cat.name}</span>
                          {isBuiltin ? (
                            <Lock size={13} className="text-slate-300 flex-shrink-0" aria-label="기본 카테고리" />
                          ) : confirmDeleteCat === cat.id ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-500">삭제?</span>
                              <button onClick={() => handleDeleteCat(cat.id)}
                                className="px-2 py-0.5 bg-red-500 text-white rounded text-xs">삭제</button>
                              <button onClick={() => setConfirmDeleteCat(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs">취소</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDeleteCat(cat.id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 앱 정보 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h3 className="font-semibold text-slate-700 mb-3">앱 정보</h3>
          <div className="space-y-2 text-sm text-slate-500">
            <div className="flex justify-between">
              <span>버전</span><span className="font-medium text-slate-700">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>저장소</span><span className="font-medium text-slate-700">로컬 (IndexedDB)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
