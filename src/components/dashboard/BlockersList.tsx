import type { Blocker } from '@/lib/types'
import Badge, { severityVariant } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'

interface BlockersListProps {
  blockers: Blocker[]
  openMilestoneCountByVenture: Record<string, number>
}

export default function BlockersList({ blockers, openMilestoneCountByVenture }: BlockersListProps) {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-white">Open Blockers</h2>
      </div>
      {blockers.length === 0 ? (
        <EmptyState message="No open blockers" />
      ) : (
        <ul className="divide-y divide-neutral-800">
          {blockers.map(blocker => {
            const affectedMilestones = blocker.venture_id
              ? (openMilestoneCountByVenture[blocker.venture_id] ?? 0)
              : 0
            const isHighImpact = affectedMilestones > 1

            return (
              <li
                key={blocker.id}
                className={`px-4 py-3 flex items-start gap-3 ${isHighImpact ? 'bg-red-950/20' : ''}`}
              >
                <Badge label={blocker.severity} variant={severityVariant(blocker.severity)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-200 leading-snug">{blocker.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {blocker.ventures && (
                      <span className="text-xs text-neutral-600">{blocker.ventures.name}</span>
                    )}
                    {affectedMilestones > 0 && (
                      <span className={`text-xs font-medium ${isHighImpact ? 'text-red-400' : 'text-neutral-500'}`}>
                        {isHighImpact && '⚠ '}
                        affects {affectedMilestones} milestone{affectedMilestones !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
