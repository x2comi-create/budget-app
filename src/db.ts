import Dexie, { type Table } from 'dexie'
import type { Expense, Budget, Asset, PaymentMethod, Category } from './types'

class BudgetDB extends Dexie {
  expenses!: Table<Expense>
  budgets!: Table<Budget>
  assets!: Table<Asset>
  paymentMethods!: Table<PaymentMethod>
  customCategories!: Table<Category>

  constructor() {
    super('가계부')
    this.version(1).stores({
      expenses: '++id, date, categoryId, type, paymentMethodId',
      budgets: '++id, [yearMonth+categoryId], yearMonth',
      assets: '++id, yearMonth, type',
      paymentMethods: 'id',
    })
    this.version(2).stores({
      expenses: '++id, date, categoryId, type, paymentMethodId',
      budgets: '++id, [yearMonth+categoryId], yearMonth',
      assets: '++id, yearMonth, type',
      paymentMethods: 'id',
      customCategories: 'id, parent, type',
    })
  }
}

export const db = new BudgetDB()

export async function initDefaults() {
  const count = await db.paymentMethods.count()
  if (count === 0) {
    await db.paymentMethods.bulkPut([
      { id: 'cash', name: '현금', color: '#6b7280', type: 'cash' },
      { id: 'debit', name: '체크카드', color: '#3b82f6', type: 'debit' },
      { id: 'credit-samsung', name: '삼성카드', color: '#ef4444', type: 'credit' },
      { id: 'credit-kb', name: 'KB카드', color: '#f59e0b', type: 'credit' },
    ])
  }
}
