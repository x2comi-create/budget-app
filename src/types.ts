export type ExpenseType = 'fixed' | 'variable' | 'saving'

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: ExpenseType
  parent?: string
}

export interface PaymentMethod {
  id: string
  name: string
  color: string
  type: 'credit' | 'debit' | 'cash' | 'transfer'
}

export interface Expense {
  id?: number
  date: string        // YYYY-MM-DD
  amount: number
  categoryId: string
  description: string
  paymentMethodId: string
  type: ExpenseType
  memo?: string
  isNoSpend?: boolean
}

export interface Budget {
  id?: number
  yearMonth: string   // YYYY-MM
  categoryId: string
  amount: number
}

export interface Asset {
  id?: number
  name: string
  type: 'savings' | 'investment' | 'real_estate' | 'other'
  amount: number
  yearMonth: string   // YYYY-MM
  note?: string
}
