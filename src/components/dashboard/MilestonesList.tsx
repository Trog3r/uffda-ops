import type { Milestone } from '@/lib/types'
import Badge, { statusVariant } from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'

interface MilestonesListProps {
  milestones: Milestone[]
}

function formatDue(dateStr: string | null) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const overdue = diffDays < 0
  const label = overdue
    ? `${Math.abs(diffDays)}d overdue`
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return { label, overdue }
}

function milestoneProgress(status: string): { pct: number; color: 'green' | 'blue' | 'neutral' } {
  switch (status) {
    case 'done':        return { pct: 100, color: 'green' }
    case 'in_progress': return { pct: 50,  color: 'blue' }
    default:            return { pct: 0,   color: 'neutral' }
  }
}

export default function MilestonesList({ milestones }: MilestonesListProps) {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-white">Upcoming Milestones</h2>
      </div>
      {milestones.length === 0 ? (
        <EmptyState message="No upcoming milestones" />
      ) : (
        <ul className="divide-y divide-neutral-800">
          {milestones.map(milestone => {
            const due = formatDue(milestone.due_date)
            const { pct, color } = milestoneProgress(milestone.status)
            return (
              <li key={milestone.id} className="px-4 py-3">
                <div className="flex items-start gap-3 mb-2">
                  <Badge label={milestone.status.replace('_', ' ')} variant={statusVariant(milestone.status)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-neutral-200 leading-snug">{milestone.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {milestone.ventures && (
                        <span className="text-xs text-neutral-600">{milestone.ventures.name}</span>
                      )}
                      {due && (
                        <span className={`text-xs ${due.overdue ? 'text-red-400' : 'text-neutral-500'}`}>
                          {due.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ProgressBar value={pct} color={color} height="xs" />
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
