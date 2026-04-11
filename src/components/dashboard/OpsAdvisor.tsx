'use client'

import { useState, useTransition } from 'react'

interface Recommendation {
  id: string
  top_priorities: string
  biggest_blocker: string
  fastest_path_to_revenue: string
  what_can_wait: string
  suggested_next_action: string
  created_at: string
}

interface OpsAdvisorProps {
  latest: Recommendation | null
}

export default function OpsAdvisor({ latest }: OpsAdvisorProps) {
  const [rec, setRec] = useState<Recommendation | null>(latest)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function refresh() {
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/ai-advisor', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'Something went wrong')
        return
      }
      const data = await res.json()
      setRec(data)
    })
  }

  const timestamp = rec
    ? new Date(rec.created_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      })
    : null

  return (
    <div className="rounded-lg border border-neutral-800 bg-[#111] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Ops Advisor</h2>
          {timestamp && (
            <p className="text-xs text-neutral-600 mt-0.5">Last updated {timestamp}</p>
          )}
        </div>
        <button
          onClick={refresh}
          disabled={isPending}
          className="text-xs px-3 py-1.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 hover:text-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Thinking…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 mb-3">{error}</p>
      )}

      {!rec && !isPending && (
        <p className="text-sm text-neutral-500">No recommendations yet. Hit Refresh to get your first brief.</p>
      )}

      {isPending && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-neutral-800 rounded animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
          ))}
        </div>
      )}

      {rec && !isPending && (
        <div className="space-y-4">
          <Section label="Top Priorities" value={rec.top_priorities} />
          <Section label="Biggest Blocker" value={rec.biggest_blocker} accent="red" />
          <Section label="Fastest Path to Revenue" value={rec.fastest_path_to_revenue} accent="green" />
          <Section label="What Can Wait" value={rec.what_can_wait} />
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Next Action</p>
            <p className="text-sm text-white font-medium">{rec.suggested_next_action}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ label, value, accent }: { label: string; value: string; accent?: 'red' | 'green' }) {
  const textColor = accent === 'red' ? 'text-red-400' : accent === 'green' ? 'text-emerald-400' : 'text-neutral-300'
  return (
    <div>
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm whitespace-pre-line ${textColor}`}>{value}</p>
    </div>
  )
}
