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
    <div className="rounded-lg border border-orange-500/20 bg-[#0d0a06] p-5" style={{ boxShadow: '0 0 0 1px rgba(249,115,22,0.06), inset 0 1px 0 rgba(249,115,22,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
          <div>
            <h2 className="text-sm font-semibold text-white">Ops Advisor</h2>
            {timestamp && (
              <p className="text-[10px] text-slate-600 mt-0.5 uppercase tracking-wide">Briefing — {timestamp}</p>
            )}
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={isPending}
          className="text-xs px-3 py-1.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 hover:text-orange-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        >
          {isPending ? 'Thinking…' : 'Refresh brief'}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400 mb-3">{error}</p>
      )}

      {!rec && !isPending && (
        <p className="text-sm text-slate-500">No briefing yet. Hit <span className="text-orange-400">Refresh brief</span> to generate your first advisory.</p>
      )}

      {isPending && (
        <div className="space-y-2.5">
          {[80, 70, 90, 60, 75].map((w, i) => (
            <div key={i} className="h-2.5 bg-slate-800 rounded-full animate-pulse" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {rec && !isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <BriefingCard label="Top Priorities" value={rec.top_priorities} />
          <BriefingCard label="Biggest Blocker" value={rec.biggest_blocker} accent="red" />
          <BriefingCard label="Fastest Path to Revenue" value={rec.fastest_path_to_revenue} accent="green" />
          <BriefingCard label="What Can Wait" value={rec.what_can_wait} />
          <div className="sm:col-span-2 lg:col-span-2 rounded-md bg-orange-500/[0.07] border border-orange-500/15 p-3">
            <p className="ops-label text-orange-400/70 mb-1.5">Suggested Next Action</p>
            <p className="text-sm text-white font-medium leading-snug">{rec.suggested_next_action}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function BriefingCard({ label, value, accent }: { label: string; value: string; accent?: 'red' | 'green' }) {
  const textColor = accent === 'red' ? 'text-red-400' : accent === 'green' ? 'text-emerald-400' : 'text-slate-300'
  return (
    <div>
      <p className="ops-label mb-1.5">{label}</p>
      <p className={`text-sm whitespace-pre-line leading-relaxed ${textColor}`}>{value}</p>
    </div>
  )
}
