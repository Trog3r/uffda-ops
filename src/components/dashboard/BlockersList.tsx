'use client'

import { useState } from 'react'
import type { Blocker } from '@/lib/types'
import BlockerItem from './BlockerItem'
import NewBlockerForm from './NewBlockerForm'
import EmptyState from '@/components/ui/EmptyState'

interface Venture { id: string; name: string }

interface BlockersListProps {
  blockers: Blocker[]
  openMilestoneCountByVenture: Record<string, number>
  ventures: Venture[]
}

export default function BlockersList({ blockers, openMilestoneCountByVenture, ventures }: BlockersListProps) {
  const [adding, setAdding] = useState(false)
  const visible = blockers.filter(b => b.status !== 'resolved')

  return (
    <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">
          Open Blockers
          {visible.length > 0 && (
            <span className="ml-2 text-xs font-normal text-neutral-500">{visible.length}</span>
          )}
        </h2>
        <button
          onClick={() => setAdding(a => !a)}
          className="text-xs px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-colors"
        >
          + New
        </button>
      </div>

      {adding && (
        <NewBlockerForm ventures={ventures} onDone={() => setAdding(false)} />
      )}

      {visible.length === 0 && !adding ? (
        <EmptyState message="No open blockers" />
      ) : (
        <ul>
          {blockers.map(blocker => (
            <BlockerItem
              key={blocker.id}
              blocker={blocker}
              affectedMilestones={blocker.venture_id ? (openMilestoneCountByVenture[blocker.venture_id] ?? 0) : 0}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
