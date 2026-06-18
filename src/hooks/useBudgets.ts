import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

export function useBudgets(yearMonth: string) {
  return useLiveQuery(
    () => db.budgets.where('yearMonth').equals(yearMonth).toArray(),
    [yearMonth]
  ) ?? []
}

export async function setBudget(yearMonth: string, categoryId: string, amount: number) {
  const existing = await db.budgets
    .where('[yearMonth+categoryId]')
    .equals([yearMonth, categoryId])
    .first()

  if (existing?.id) {
    return db.budgets.update(existing.id, { amount })
  }
  return db.budgets.add({ yearMonth, categoryId, amount })
}

export async function getBudget(yearMonth: string, categoryId: string): Promise<number> {
  const b = await db.budgets
    .where('[yearMonth+categoryId]')
    .equals([yearMonth, categoryId])
    .first()
  return b?.amount ?? 0
}
