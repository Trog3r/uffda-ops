'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { BlockerSeverity } from '@/lib/types'

interface Venture {
  id: string
  name: string
}

interface NewBlockerFormProps {
  ventures: Venture[]
  onDone: () => void
}

const SEVERITIES: BlockerSeverity[] = ['low', 'medium', 'high', 'critical']

const severityStyle: Record<BlockerSeverity, string> = {
  low:      'border-neutral-700 text-neutral-400',
  medium:   'border-sky-700/50 text-sky-400',
  high:     'border-amber-700/50 text-amber-400',
  critical: 'border-red-700/50 text-red-400',
}
const severityActiveStyle: Record<BlockerSeverity, string> = {
  low:      'bg-neutral-800 border-neutral-600 text-neutral-200',
  medium:   'bg-sky-950/60 border-sky-600/50 text-sky-300',
  high:     'bg-amber-950/60 border-amber-600/50 text-amber-300',
  critical: 'bg-red-950/60 border-red-600/50 text-red-300',
}

export default function NewBlockerForm({ ventures, onDone }: NewBlockerFormProps) {
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<BlockerSeverity>('medium')
  const [ventureId, setVentureId] = useState(ventures[0]?.id ?? '')
  const [nextAction, setNextAction] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('blockers').insert({
      title: title.trim(),
      severity,
      venture_id: ventureId || null,
      next_action: nextAction.trim() || null,
      status: 'open',
    })
    setSaving(false)
    router.refresh()
    onDone()
  }

  return (
    <form onSubmit={submit} className="px-4 py-4 border-b border-neutral-800 bg-neutral-900/40">
      <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">New Blocker</p>

      {/* Title */}
      <input
        autoFocus
        type="text"
        placeholder="What's blocking you?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        className="w-full bg-[#0d1829] border border-neutral-700 rounded-md px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 mb-3 transition-colors"
      />

      {/* Severity */}
      <div className="flex gap-1.5 mb-3">
        {SEVERITIES.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setSeverity(s)}
            className={`text-xs px-2.5 py-1 rounded border capitalize transition-colors ${
              severity === s ? severityActiveStyle[s] : severityStyle[s] + ' hover:opacity-80'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Venture + Next action */}
      <div className="flex gap-2 mb-3">
        <select
          value={ventureId}
          onChange={e => setVentureId(e.target.value)}
          className="flex-1 bg-[#0d1829] border border-neutral-700 rounded-md px-3 py-2 text-sm text-neutral-300 focus:outline-none focus:border-neutral-500 transition-colors"
        >
          <option value="">No venture</option>
          {ventures.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Next action…"
          value={nextAction}
          onChange={e => setNextAction(e.target.value)}
          className="flex-[2] bg-[#0d1829] border border-neutral-700 rounded-md px-3 py-2 text-sm text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="px-4 py-1.5 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-400 disabled:opacity-40 transition-colors"
        >
          {saving ? 'Adding…' : 'Add blocker'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-3 py-1.5 rounded-md text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
