import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { CATEGORIES } from '../categories'
import type { Category, ExpenseType } from '../types'

export function useAllCategories(): Category[] {
  const custom = useLiveQuery(() => db.customCategories.toArray()) ?? []
  return [...CATEGORIES, ...custom]
}

export async function addCustomCategory(cat: Omit<Category, 'id'>): Promise<string> {
  const id = `custom-${Date.now()}`
  await db.customCategories.put({ ...cat, id })
  return id
}

export async function deleteCustomCategory(id: string) {
  return db.customCategories.delete(id)
}

// parent 그룹 ID로부터 ExpenseType 결정
export function typeFromParent(parentId: string): ExpenseType {
  if (parentId === 'saving') return 'saving'
  if (parentId === 'fixed-home' || parentId === 'fixed-transport') return 'fixed'
  return 'variable'
}
