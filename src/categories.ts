import type { Category } from './types'

export const CATEGORIES: Category[] = [
  // 저축
  { id: 'saving-subscription', name: '주택청약', icon: '🏠', color: '#8b5cf6', type: 'saving', parent: 'saving' },
  { id: 'saving-deposit', name: '적금', icon: '💰', color: '#7c3aed', type: 'saving', parent: 'saving' },
  { id: 'saving-investment', name: '투자', icon: '📈', color: '#6d28d9', type: 'saving', parent: 'saving' },
  { id: 'saving-etc', name: '기타 저축', icon: '🏦', color: '#5b21b6', type: 'saving', parent: 'saving' },

  // 고정지출 - 주거
  { id: 'fixed-loan', name: '대출 이자', icon: '🏢', color: '#0ea5e9', type: 'fixed', parent: 'fixed-home' },
  { id: 'fixed-maintenance', name: '관리비', icon: '🔧', color: '#0284c7', type: 'fixed', parent: 'fixed-home' },
  { id: 'fixed-electric', name: '전기세', icon: '⚡', color: '#0369a1', type: 'fixed', parent: 'fixed-home' },
  { id: 'fixed-gas', name: '가스비', icon: '🔥', color: '#075985', type: 'fixed', parent: 'fixed-home' },
  { id: 'fixed-internet', name: '인터넷비', icon: '📡', color: '#0c4a6e', type: 'fixed', parent: 'fixed-home' },
  { id: 'fixed-insurance', name: '보험비', icon: '🛡️', color: '#164e63', type: 'fixed', parent: 'fixed-home' },

  // 고정지출 - 교통/통신
  { id: 'fixed-phone', name: '휴대폰 요금', icon: '📱', color: '#10b981', type: 'fixed', parent: 'fixed-transport' },
  { id: 'fixed-bus', name: '버스/지하철', icon: '🚌', color: '#059669', type: 'fixed', parent: 'fixed-transport' },
  { id: 'fixed-taxi', name: '택시', icon: '🚕', color: '#047857', type: 'fixed', parent: 'fixed-transport' },

  // 변동지출 - 식비
  { id: 'food-grocery', name: '마트/장보기', icon: '🛒', color: '#f59e0b', type: 'variable', parent: 'food' },
  { id: 'food-delivery', name: '배달', icon: '🛵', color: '#d97706', type: 'variable', parent: 'food' },
  { id: 'food-restaurant', name: '외식', icon: '🍽️', color: '#b45309', type: 'variable', parent: 'food' },
  { id: 'food-cafe', name: '카페/커피', icon: '☕', color: '#92400e', type: 'variable', parent: 'food' },
  { id: 'food-convenience', name: '편의점', icon: '🏪', color: '#78350f', type: 'variable', parent: 'food' },

  // 변동지출 - 생필품
  { id: 'daily-supplies', name: '생활용품', icon: '🧴', color: '#ef4444', type: 'variable', parent: 'daily' },
  { id: 'daily-medicine', name: '의약품', icon: '💊', color: '#dc2626', type: 'variable', parent: 'daily' },

  // 변동지출 - 여가/문화
  { id: 'leisure-travel', name: '여행', icon: '✈️', color: '#ec4899', type: 'variable', parent: 'leisure' },
  { id: 'leisure-exercise', name: '운동/헬스', icon: '💪', color: '#db2777', type: 'variable', parent: 'leisure' },
  { id: 'leisure-culture', name: '문화/취미', icon: '🎭', color: '#be185d', type: 'variable', parent: 'leisure' },
  { id: 'leisure-family', name: '가족/모임', icon: '👨‍👩‍👧', color: '#9d174d', type: 'variable', parent: 'leisure' },

  // 변동지출 - 미용/패션
  { id: 'beauty-hair', name: '미용', icon: '💇', color: '#f97316', type: 'variable', parent: 'beauty' },
  { id: 'beauty-shopping', name: '쇼핑/의류', icon: '👗', color: '#ea580c', type: 'variable', parent: 'beauty' },

  // 변동지출 - 경조사/기타
  { id: 'social-event', name: '경조사', icon: '🎁', color: '#84cc16', type: 'variable', parent: 'social' },
  { id: 'social-donation', name: '기부금', icon: '❤️', color: '#65a30d', type: 'variable', parent: 'social' },
  { id: 'etc', name: '기타', icon: '📦', color: '#6b7280', type: 'variable', parent: 'etc' },
]

export const PARENT_GROUPS = [
  { id: 'saving', name: '저축/투자', icon: '💰', color: '#8b5cf6' },
  { id: 'fixed-home', name: '주거', icon: '🏠', color: '#0ea5e9' },
  { id: 'fixed-transport', name: '교통/통신', icon: '🚌', color: '#10b981' },
  { id: 'food', name: '식비', icon: '🍽️', color: '#f59e0b' },
  { id: 'daily', name: '생필품', icon: '🧴', color: '#ef4444' },
  { id: 'leisure', name: '여가/문화', icon: '✈️', color: '#ec4899' },
  { id: 'beauty', name: '미용/패션', icon: '👗', color: '#f97316' },
  { id: 'social', name: '경조사/기타', icon: '🎁', color: '#84cc16' },
]

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id)
}

export function getCategoriesByType(type: string) {
  return CATEGORIES.filter(c => c.type === type)
}

export function getCategoriesByParent(parent: string) {
  return CATEGORIES.filter(c => c.parent === parent)
}
