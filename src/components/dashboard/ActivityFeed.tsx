import type { ActivityLog } from '@/lib/types'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'

interface ActivityFeedProps {
  activity: ActivityLog[]
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export default function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
      </div>
      {activity.length === 0 ? (
        <EmptyState message="No recent activity" />
      ) : (
        <ul className="divide-y divide-neutral-800">
          {activity.map(entry => (
            <li key={entry.id} className="px-4 py-3 flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-300 leading-snug">{entry.note ?? entry.action}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {entry.ventures && (
                    <span className="text-xs text-neutral-600">{entry.ventures.name}</span>
                  )}
                  <span className="text-xs text-neutral-700">{relativeTime(entry.created_at)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
