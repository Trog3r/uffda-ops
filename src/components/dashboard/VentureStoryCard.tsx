import type { Venture, Milestone, Blocker, BlockerSeverity } from '@/lib/types'
import Badge, { statusVariant } from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'

interface VentureStoryCardProps {
  venture: Venture
  currentMilestone: Milestone | null
  blockers: Blocker[]
  milestoneStats: { total: number; done: number }
}

const SEVERITY_ORDER: Record<BlockerSeverity, number> = {
  critical: 4, high: 3, medium: 2, low: 1,
}

const severityDot: Record<BlockerSeverity, string> = {
  critical: 'bg-red-500',
  high:     'bg-amber-500',
  medium:   'bg-sky-500',
  low:      'bg-neutral-500',
}

function formatDue(dateStr: string | null): { label: string; overdue: boolean } | null {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, overdue: true }
  if (diffDays === 0) return { label: 'due today', overdue: false }
  if (diffDays <= 7) return { label: `due in ${diffDays}d`, overdue: false }
  return {
    label: `due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    overdue: false,
  }
}

function progressColor(pct: number, hasBlockers: boolean): 'teal' | 'yellow' | 'red' {
  if (hasBlockers) return 'yellow'
  if (pct >= 66) return 'teal'
  if (pct >= 33) return 'yellow'
  return 'red'
}

export default function VentureStoryCard({
  venture,
  currentMilestone,
  blockers,
  milestoneStats,
}: VentureStoryCardProps) {
  const accentColor = venture.color ?? '#6366f1'
  const sortedBlockers = [...blockers].sort(
    (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]
  )
  const topBlocker = sortedBlockers[0] ?? null
  const overallPct = milestoneStats.total > 0
    ? Math.round((milestoneStats.done / milestoneStats.total) * 100)
    : 0
  const milestonePct = currentMilestone?.progress ?? 0
  const dueInfo = currentMilestone ? formatDue(currentMilestone.due_date) : null
  const barColor = progressColor(milestonePct, blockers.length > 0)

  return (
    <div
      className="bg-[#080f1d] border border-white/[0.07] rounded-lg p-4 flex flex-col gap-3 hover:bg-[#0d1626] transition-colors"
      style={{ borderTopColor: accentColor, borderTopWidth: 2 }}
    >
      {/* Venture header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white leading-tight truncate">{venture.name}</h3>
          {milestoneStats.total > 0 && (
            <p className="text-xs text-slate-600 mt-0.5 tabular-nums">
              {milestoneStats.done}/{milestoneStats.total} milestones complete
            </p>
          )}
        </div>
        <Badge label={venture.status} variant={statusVariant(venture.status)} />
      </div>

      {/* Current milestone */}
      {currentMilestone ? (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-medium text-slate-200 leading-snug truncate">
              {currentMilestone.title}
            </p>
            {dueInfo && (
              <span className={`text-xs shrink-0 tabular-nums ${dueInfo.overdue ? 'text-red-400' : 'text-slate-500'}`}>
                {dueInfo.label}
              </span>
            )}
          </div>

          {currentMilestone.description && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {currentMilestone.description}
            </p>
          )}

          <ProgressBar value={milestonePct} color={barColor} height="sm" showLabel />
        </div>
      ) : milestoneStats.total > 0 ? (
        <p className="text-xs text-emerald-600 font-medium">✓ All milestones complete</p>
      ) : (
        <p className="text-xs text-slate-700">No milestones yet</p>
      )}

      {/* Blockers */}
      <div className="border-t border-white/[0.05] pt-2.5 space-y-1.5">
        {sortedBlockers.length > 0 ? (
          <>
            {sortedBlockers.map(b => (
              <div key={b.id} className="flex items-start gap-2">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${severityDot[b.severity]}`} />
                <span className="text-xs text-slate-400 leading-relaxed">{b.title}</span>
              </div>
            ))}
            {topBlocker?.next_action && (
              <p className="text-xs text-amber-500 pl-3.5 leading-relaxed">
                → {topBlocker.next_action}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-emerald-700">✓ No active blockers</p>
        )}
      </div>
    </div>
  )
}
