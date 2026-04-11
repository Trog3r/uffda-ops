'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Blocker, BlockerStatus } from '@/lib/types'
import Badge, { severityVariant } from '@/components/ui/Badge'

interface BlockerItemProps {
  blocker: Blocker
  affectedMilestones?: number
}

export default function BlockerItem({ blocker: initial, affectedMilestones = 0 }: BlockerItemProps) {
  const [b, setB] = useState(initial)
  const router = useRouter()

  async function setStatus(status: BlockerStatus) {
    const prev = b
    setB(curr => ({ ...curr, status, resolved_at: status === 'resolved' ? new Date().toISOString() : null }))
    const supabase = createClient()
    const { error } = await supabase
      .from('blockers')
      .update({
        status,
        resolved_at: status === 'resolved' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', b.id)
    if (error) setB(prev)
    else router.refresh()
  }

  const isHighImpact = affectedMilestones > 1
  const resolved = b.status === 'resolved'

  if (resolved) return null // hide resolved blockers from the list

  return (
    <li className={`px-4 py-3 border-b border-neutral-800 last:border-0 ${isHighImpact ? 'bg-red-950/10' : ''}`}>
      <div className="flex items-start gap-3">
        <Badge label={b.severity} variant={severityVariant(b.severity)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-200 leading-snug">{b.title}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
            {b.ventures && <span className="text-xs text-neutral-600">{b.ventures.name}</span>}
            {isHighImpact && (
              <span className="text-xs text-red-400">⚠ {affectedMilestones} milestones</span>
            )}
            {b.next_action && (
              <span className="text-xs text-amber-500/80">→ {b.next_action}</span>
            )}
          </div>
        </div>
        {/* Quick status actions */}
        <div className="flex gap-1 shrink-0">
          {b.status === 'open' && (
            <button
              onClick={() => setStatus('in_progress')}
              className="text-[11px] px-2 py-0.5 rounded border border-sky-700/40 text-sky-400 hover:bg-sky-950/40 transition-colors"
            >
              Working
            </button>
          )}
          {b.status === 'in_progress' && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-950/30 border border-sky-700/30 text-sky-400">
              Active
            </span>
          )}
          <button
            onClick={() => setStatus('resolved')}
            className="text-[11px] px-2 py-0.5 rounded border border-emerald-700/40 text-emerald-500 hover:bg-emerald-950/40 transition-colors"
          >
            Resolve
          </button>
        </div>
      </div>
    </li>
  )
}
