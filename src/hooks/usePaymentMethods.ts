import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { PaymentMethod } from '../types'

export function usePaymentMethods() {
  return useLiveQuery(() => db.paymentMethods.toArray()) ?? []
}

export async function addPaymentMethod(pm: PaymentMethod) {
  return db.paymentMethods.put(pm)
}

export async function deletePaymentMethod(id: string) {
  return db.paymentMethods.delete(id)
}
