import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ko } from 'date-fns/locale'

export function formatMoney(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원'
}

export function formatMoneyShort(amount: number): string {
  if (amount >= 10000) {
    const man = amount / 10000
    return man % 1 === 0 ? `${man}만원` : `${man.toFixed(1)}만원`
  }
  return amount.toLocaleString('ko-KR') + '원'
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'M월 d일 (E)', { locale: ko })
}

export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  return `${year}년 ${parseInt(month)}월`
}

export function getCurrentYearMonth(): string {
  return format(new Date(), 'yyyy-MM')
}

export function getMonthRange(yearMonth: string): { start: string; end: string } {
  const date = new Date(yearMonth + '-01')
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  }
}

export function getPrevMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number)
  if (month === 1) return `${year - 1}-12`
  return `${year}-${String(month - 1).padStart(2, '0')}`
}

export function getNextMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number)
  if (month === 12) return `${year + 1}-01`
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export function getDaysInMonth(yearMonth: string): string[] {
  const date = new Date(yearMonth + '-01')
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const days: string[] = []
  const cur = new Date(start)
  while (cur <= end) {
    days.push(format(cur, 'yyyy-MM-dd'))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getWeekOfMonth(dateStr: string): number {
  const date = new Date(dateStr)
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7)
}
