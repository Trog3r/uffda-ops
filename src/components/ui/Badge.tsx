interface BadgeProps {
  label: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'
}

const variants = {
  default: 'bg-neutral-700 text-neutral-300',
  success: 'bg-emerald-900/50 text-emerald-400',
  warning: 'bg-amber-900/50 text-amber-400',
  danger:  'bg-red-900/50 text-red-400',
  info:    'bg-sky-900/50 text-sky-400',
  muted:   'bg-neutral-800 text-neutral-500',
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {label}
    </span>
  )
}

export function severityVariant(severity: string): BadgeProps['variant'] {
  switch (severity) {
    case 'critical': return 'danger'
    case 'high':     return 'warning'
    case 'medium':   return 'info'
    default:         return 'muted'
  }
}

export function statusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'done':
    case 'resolved':   return 'success'
    case 'in_progress': return 'info'
    case 'cancelled':  return 'muted'
    case 'open':
    case 'pending':    return 'default'
    default:           return 'default'
  }
}
