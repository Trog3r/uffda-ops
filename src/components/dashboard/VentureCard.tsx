import type { Venture, Milestone } from '@/lib/types'
import Badge, { statusVariant } from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'

interface MilestoneStats {
  total: number
  done: number
}

type Health = 'green' | 'yellow' | 'red' | 'neutral'

interface VentureCardProps {
  venture: Venture
  openBlockerCount: number
  maxBlockerSeverity: string | null
  nextMilestone: Milestone | null
  milestoneStats: MilestoneStats
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

function getHealth(openBlockerCount: number, maxSeverity: string | null): Health {
  if (openBlockerCount === 0) return 'green'
  if (maxSeverity === 'critical' || maxSeverity === 'high') return 'red'
  return 'yellow'
}

const healthBorder: Record<Health, string> = {
  green:   'border-white/[0.08]',
  yellow:  'border-amber-600/20',
  red:     'border-red-600/20',
  neutral: 'border-white/[0.06]',
}

const progressColor: Record<Health, 'teal' | 'yellow' | 'red' | 'neutral'> = {
  green:   'teal',
  yellow:  'yellow',
  red:     'red',
  neutral: 'neutral',
}

export default function VentureCard({
  venture,
  openBlockerCount,
  maxBlockerSeverity,
  nextMilestone,
  milestoneStats,
}: VentureCardProps) {
  const accentColor = venture.color ?? '#6366f1'
  const dueInfo = nextMilestone?.due_date ? formatDate(nextMilestone.due_date) : null
  const health = venture.status === 'active' ? getHealth(openBlockerCount, maxBlockerSeverity) : 'neutral'
  const pct = milestoneStats.total > 0
    ? Math.round((milestoneStats.done / milestoneStats.total) * 100)
    : 0

  return (
    <div
      className={`bg-[#080f1d] border rounded-lg p-4 flex flex-col gap-3 hover:bg-[#0d1626] transition-colors ${healthBorder[health]}`}
      style={{ borderTopColor: accentColor, borderTopWidth: 2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-tight truncate">{venture.name}</h3>
        <Badge label={venture.status} variant={statusVariant(venture.status)} />
      </div>

      {venture.description && (
        <p className="text-xs text-slate-500 leading-relaxed">{venture.description}</p>
      )}

      {/* Progress */}
      {milestoneStats.total > 0 ? (
        <div className="space-y-1.5">
          <ProgressBar
            value={pct}
            color={progressColor[health]}
            height="sm"
            showLabel
          />
          <p className="text-xs text-slate-600">
            {milestoneStats.done} / {milestoneStats.total} milestones
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-700">No milestones</p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs mt-auto pt-2.5 border-t border-white/[0.05]">
        {openBlockerCount > 0 ? (
          <span className={(maxBlockerSeverity === 'critical' || maxBlockerSeverity === 'high') ? 'text-red-400 font-medium' : 'text-amber-400 font-medium'}>
            {openBlockerCount} blocker{openBlockerCount !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-emerald-700">Clear</span>
        )}

        {nextMilestone && (
          <span className={dueInfo?.overdue ? 'text-red-400' : 'text-slate-500'}>
            {dueInfo ? `Due ${dueInfo.label}` : nextMilestone.title.slice(0, 24)}
          </span>
        )}
      </div>
    </div>
  )
}
