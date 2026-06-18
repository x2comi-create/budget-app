import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { onEvent, emitEvent } from '../lib/events'
import { CATEGORIES } from '../categories'
import type { Category, ExpenseType } from '../types'

function toCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    icon: row.icon as string,
    color: row.color as string,
    type: row.type as ExpenseType,
    parent: row.parent as string,
  }
}

export function useAllCategories(): Category[] {
  const [custom, setCustom] = useState<Category[]>([])

  const fetchCustom = useCallback(async () => {
    const { data } = await supabase.from('custom_categories').select('*')
    if (data) setCustom(data.map(toCategory))
  }, [])

  useEffect(() => {
    fetchCustom()
    return onEvent('categories', fetchCustom)
  }, [fetchCustom])

  return [...CATEGORIES, ...custom]
}

export async function addCustomCategory(cat: Omit<Category, 'id'>): Promise<string> {
  const id = `custom-${Date.now()}`
  const { error } = await supabase.from('custom_categories').insert({ ...cat, id })
  if (error) throw error
  emitEvent('categories')
  return id
}

export async function deleteCustomCategory(id: string) {
  const { error } = await supabase.from('custom_categories').delete().eq('id', id)
  if (error) throw error
  emitEvent('categories')
}

export function typeFromParent(parentId: string): ExpenseType {
  if (parentId === 'saving') return 'saving'
  if (parentId === 'fixed-home' || parentId === 'fixed-transport') return 'fixed'
  return 'variable'
}
