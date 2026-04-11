import type { Blocker } from '@/lib/types'
import Badge, { severityVariant } from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'

interface BlockersListProps {
  blockers: Blocker[]
}

export default function BlockersList({ blockers }: BlockersListProps) {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-white">Open Blockers</h2>
      </div>
      {blockers.length === 0 ? (
        <EmptyState message="No open blockers" />
      ) : (
        <ul className="divide-y divide-neutral-800">
          {blockers.map(blocker => (
            <li key={blocker.id} className="px-4 py-3 flex items-start gap-3">
              <Badge label={blocker.severity} variant={severityVariant(blocker.severity)} />
              <div className="min-w-0">
                <p className="text-sm text-neutral-200 leading-snug">{blocker.title}</p>
                {blocker.ventures && (
                  <p className="text-xs text-neutral-600 mt-0.5">{blocker.ventures.name}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
