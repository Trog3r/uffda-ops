import type { Venture, Milestone } from '@/lib/types'
import Badge, { statusVariant } from '@/components/ui/Badge'

interface VentureCardProps {
  venture: Venture
  openBlockerCount: number
  nextMilestone: Milestone | null
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, overdue: true }
  if (diffDays === 0) return { label: 'Today', overdue: false }
  if (diffDays <= 7) return { label: `${diffDays}d`, overdue: false }
  return {
    label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue: false,
  }
}

export default function VentureCard({ venture, openBlockerCount, nextMilestone }: VentureCardProps) {
  const accentColor = venture.color ?? '#6366f1'
  const dueInfo = nextMilestone?.due_date ? formatDate(nextMilestone.due_date) : null

  return (
    <div
      className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-4 flex flex-col gap-3 hover:border-neutral-700 transition-colors"
      style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-tight">{venture.name}</h3>
        <Badge label={venture.status} variant={statusVariant(venture.status)} />
      </div>

      {venture.description && (
        <p className="text-xs text-neutral-500 leading-relaxed">{venture.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-neutral-500 mt-auto pt-1 border-t border-neutral-800">
        {openBlockerCount > 0 ? (
          <span className="text-red-400 font-medium">
            {openBlockerCount} blocker{openBlockerCount !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-emerald-600">No blockers</span>
        )}

        {nextMilestone && (
          <span className={dueInfo?.overdue ? 'text-red-400' : 'text-neutral-400'}>
            {dueInfo ? `Due ${dueInfo.label}` : nextMilestone.title.slice(0, 24)}
          </span>
        )}
      </div>
    </div>
  )
}
