import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export const SCRAP_TYPES = [
  { value: 'iron', label: 'Iron' },
  { value: 'copper', label: 'Copper' },
  { value: 'aluminium', label: 'Aluminium' },
  { value: 'plastic', label: 'Plastic' },
  { value: 'brass', label: 'Brass' },
  { value: 'stainless_steel', label: 'Stainless Steel' },
  { value: 'mixed', label: 'Mixed' },
]

export const TAGS = [
  'High Value',
  'Nearby',
  'Urgent',
  'Cold Lead',
  'Regular',
  'New',
  'Priority',
]

export const STAGES = [
  { value: 'NEW_LEAD', label: 'New Lead', color: '#6366f1' },
  { value: 'CONTACTED', label: 'Contacted', color: '#3b82f6' },
  { value: 'FOLLOW_UP_NEEDED', label: 'Follow-up Needed', color: '#f59e0b' },
  { value: 'INTERESTED', label: 'Interested', color: '#10b981' },
  { value: 'REGULAR_SUPPLIER', label: 'Regular Supplier', color: '#059669' },
  { value: 'DEAL_FINALIZED', label: 'Deal Finalized', color: '#8b5cf6' },
  { value: 'NOT_INTERESTED', label: 'Not Interested', color: '#ef4444' },
  { value: 'INVALID_CONTACT', label: 'Invalid Contact', color: '#6b7280' },
]

export const OUTCOMES = [
  { value: 'INTERESTED', label: 'Interested', color: '#10b981' },
  { value: 'NOT_INTERESTED', label: 'Not Interested', color: '#ef4444' },
  { value: 'CALL_LATER', label: 'Call Later', color: '#f59e0b' },
  { value: 'NO_ANSWER', label: 'No Answer', color: '#6b7280' },
]

export function formatDate(date: Date | string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getStageInfo(stage: string) {
  return STAGES.find(s => s.value === stage) || STAGES[0]
}

export function getOutcomeInfo(outcome: string) {
  return OUTCOMES.find(o => o.value === outcome) || OUTCOMES[0]
}

export function isToday(date: Date | string | null) {
  if (!date) return false
  const d = new Date(date)
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

export function isOverdue(date: Date | string | null) {
  if (!date) return false
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}
