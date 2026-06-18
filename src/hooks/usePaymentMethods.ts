import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { onEvent, emitEvent } from '../lib/events'
import type { PaymentMethod } from '../types'

function toPaymentMethod(row: Record<string, unknown>): PaymentMethod {
  return {
    id: row.id as string,
    name: row.name as string,
    color: row.color as string,
    type: row.type as PaymentMethod['type'],
  }
}

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])

  const fetchMethods = useCallback(async () => {
    const { data } = await supabase.from('payment_methods').select('*').order('id')
    if (data) setMethods(data.map(toPaymentMethod))
  }, [])

  useEffect(() => {
    fetchMethods()
    return onEvent('payment_methods', fetchMethods)
  }, [fetchMethods])

  return methods
}

export async function addPaymentMethod(pm: PaymentMethod) {
  const { error } = await supabase.from('payment_methods').upsert(pm)
  if (error) throw error
  emitEvent('payment_methods')
}

export async function deletePaymentMethod(id: string) {
  const { error } = await supabase.from('payment_methods').delete().eq('id', id)
  if (error) throw error
  emitEvent('payment_methods')
}
