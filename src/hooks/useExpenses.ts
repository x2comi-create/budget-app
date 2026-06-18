import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getMonthRange } from '../utils'
import type { Expense } from '../types'

function toExpense(row: Record<string, unknown>): Expense {
  return {
    id: row.id as number,
    date: row.date as string,
    amount: row.amount as number,
    categoryId: row.category_id as string,
    description: row.description as string,
    paymentMethodId: row.payment_method_id as string,
    type: row.type as Expense['type'],
    memo: row.memo as string | undefined,
    isNoSpend: row.is_no_spend as boolean,
  }
}

export function useExpensesByMonth(yearMonth: string) {
  const [expenses, setExpenses] = useState<Expense[]>([])

  const fetchExpenses = useCallback(async () => {
    const { start, end } = getMonthRange(yearMonth)
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: true })
    if (data) setExpenses(data.map(toExpense))
  }, [yearMonth])

  useEffect(() => {
    fetchExpenses()
    const channel = supabase
      .channel(`expenses-${yearMonth}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchExpenses)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [yearMonth, fetchExpenses])

  return expenses
}

export async function addExpense(expense: Omit<Expense, 'id'>) {
  const { error } = await supabase.from('expenses').insert({
    date: expense.date,
    amount: expense.amount,
    category_id: expense.categoryId,
    description: expense.description,
    payment_method_id: expense.paymentMethodId,
    type: expense.type,
    memo: expense.memo ?? null,
    is_no_spend: expense.isNoSpend ?? false,
  })
  if (error) throw error
}

export async function updateExpense(id: number, expense: Partial<Expense>) {
  const { error } = await supabase.from('expenses').update({
    ...(expense.date && { date: expense.date }),
    ...(expense.amount !== undefined && { amount: expense.amount }),
    ...(expense.categoryId && { category_id: expense.categoryId }),
    ...(expense.description && { description: expense.description }),
    ...(expense.paymentMethodId && { payment_method_id: expense.paymentMethodId }),
    ...(expense.type && { type: expense.type }),
    ...(expense.memo !== undefined && { memo: expense.memo }),
  }).eq('id', id)
  if (error) throw error
}

export async function deleteExpense(id: number) {
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw error
}
