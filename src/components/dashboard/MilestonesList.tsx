import type { Milestone } from '@/lib/types'
import MilestoneRow from './MilestoneRow'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'

interface MilestonesListProps {
  milestones: Milestone[]
}

export default function MilestonesList({ milestones }: MilestonesListProps) {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-white">
          Active Milestones
          {milestones.length > 0 && (
            <span className="ml-2 text-xs font-normal text-neutral-500">{milestones.length}</span>
          )}
        </h2>
      </div>
      {milestones.length === 0 ? (
        <EmptyState message="No active milestones" />
      ) : (
        <ul>
          {milestones.map(m => (
            <MilestoneRow key={m.id} milestone={m} />
          ))}
        </ul>
      )}
    </Card>
  )
}
