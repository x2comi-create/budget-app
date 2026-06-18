import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { getMonthRange } from '../utils'
import type { Expense } from '../types'

export function useExpensesByMonth(yearMonth: string) {
  const { start, end } = getMonthRange(yearMonth)
  return useLiveQuery(
    () => db.expenses
      .where('date')
      .between(start, end, true, true)
      .sortBy('date'),
    [yearMonth]
  ) ?? []
}

export function useExpensesByDate(date: string) {
  return useLiveQuery(
    () => db.expenses.where('date').equals(date).toArray(),
    [date]
  ) ?? []
}

export async function addExpense(expense: Omit<Expense, 'id'>) {
  return db.expenses.add(expense)
}

export async function updateExpense(id: number, expense: Partial<Expense>) {
  return db.expenses.update(id, expense)
}

export async function deleteExpense(id: number) {
  return db.expenses.delete(id)
}
