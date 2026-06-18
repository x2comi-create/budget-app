import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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

  async function fetchMethods() {
    const { data } = await supabase.from('payment_methods').select('*').order('id')
    if (data) setMethods(data.map(toPaymentMethod))
  }

  useEffect(() => {
    fetchMethods()
    const channel = supabase
      .channel('payment_methods')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_methods' }, fetchMethods)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  return methods
}

export async function addPaymentMethod(pm: PaymentMethod) {
  const { error } = await supabase.from('payment_methods').upsert(pm)
  if (error) throw error
}

export async function deletePaymentMethod(id: string) {
  const { error } = await supabase.from('payment_methods').delete().eq('id', id)
  if (error) throw error
}
