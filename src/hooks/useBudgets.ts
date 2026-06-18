import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { onEvent, emitEvent } from '../lib/events'
import type { Budget } from '../types'

function toBudget(row: Record<string, unknown>): Budget {
  return {
    id: row.id as number,
    yearMonth: row.year_month as string,
    categoryId: row.category_id as string,
    amount: row.amount as number,
  }
}

export function useBudgets(yearMonth: string) {
  const [budgets, setBudgets] = useState<Budget[]>([])

  const fetchBudgets = useCallback(async () => {
    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('year_month', yearMonth)
    if (data) setBudgets(data.map(toBudget))
  }, [yearMonth])

  useEffect(() => {
    fetchBudgets()
    return onEvent('budgets', fetchBudgets)
  }, [fetchBudgets])

  return budgets
}

export async function setBudget(yearMonth: string, categoryId: string, amount: number) {
  const { error } = await supabase
    .from('budgets')
    .upsert({ year_month: yearMonth, category_id: categoryId, amount },
             { onConflict: 'year_month,category_id' })
  if (error) throw error
  emitEvent('budgets')
}

export async function getBudget(yearMonth: string, categoryId: string): Promise<number> {
  const { data } = await supabase
    .from('budgets')
    .select('amount')
    .eq('year_month', yearMonth)
    .eq('category_id', categoryId)
    .single()
  return data?.amount ?? 0
}
