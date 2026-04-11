'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Milestone, MilestoneStatus } from '@/lib/types'
import Badge, { statusVariant } from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'

interface MilestoneRowProps {
  milestone: Milestone
}

function formatDue(dateStr: string | null) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const overdue = diffDays < 0
  return {
    label: overdue
      ? `${Math.abs(diffDays)}d overdue`
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue,
  }
}

const STATUS_ORDER: MilestoneStatus[] = ['pending', 'in_progress', 'done']
const STATUS_LABELS: Record<MilestoneStatus, string> = {
  pending: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  cancelled: 'Cancelled',
}

export default function MilestoneRow({ milestone: initial }: MilestoneRowProps) {
  const [m, setM] = useState(initial)
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)
  const notesRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  async function patch(fields: Partial<Pick<Milestone, 'status' | 'progress' | 'notes'>>) {
    const next = { ...m, ...fields }
    setM(next)
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('milestones')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', m.id)
    setSaving(false)
    if (error) {
      setM(m) // revert
    } else {
      router.refresh()
    }
  }

  function setStatus(status: MilestoneStatus) {
    const progress = status === 'done' ? 100 : status === 'pending' ? 0 : m.progress
    patch({ status, progress })
  }

  function addProgress() {
    const next = Math.min(100, m.progress + 10)
    const status: MilestoneStatus = next === 100 ? 'done' : 'in_progress'
    patch({ progress: next, status })
  }

  function markComplete() {
    patch({ status: 'done', progress: 100 })
  }

  function saveNotes() {
    const val = notesRef.current?.value ?? ''
    if (val !== (m.notes ?? '')) patch({ notes: val || null })
  }

  const due = formatDue(m.due_date)
  const barColor = m.status === 'done' ? 'green' : m.status === 'in_progress' ? 'teal' : 'neutral'

  return (
    <li className="border-b border-neutral-800 last:border-0">
      {/* Row */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start gap-3">
          <Badge label={STATUS_LABELS[m.status] ?? m.status} variant={statusVariant(m.status)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-neutral-200 leading-snug">{m.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {m.ventures && <span className="text-xs text-neutral-600">{m.ventures.name}</span>}
              {due && (
                <span className={`text-xs ${due.overdue ? 'text-red-400' : 'text-neutral-500'}`}>
                  {due.label}
                </span>
              )}
              {saving && <span className="text-xs text-neutral-600">saving…</span>}
            </div>
          </div>
          <span className="text-xs text-neutral-600 shrink-0 mt-0.5">{m.progress}%</span>
        </div>
        <div className="mt-2 ml-[calc(theme(spacing.3)+theme(spacing.16)+theme(spacing.2))]">
          <ProgressBar value={m.progress} color={barColor} height="xs" />
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 bg-white/[0.015] border-t border-neutral-800/60">
          {/* Status selector */}
          <div className="pt-3 mb-3">
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1.5">Status</p>
            <div className="flex gap-1.5">
              {STATUS_ORDER.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    m.status === s
                      ? 'bg-cyan-950/60 border-cyan-700/50 text-cyan-300'
                      : 'bg-transparent border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Progress controls */}
          <div className="mb-3">
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1.5">Progress</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tabular-nums w-9">{m.progress}%</span>
              <ProgressBar value={m.progress} color={barColor} height="xs" />
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={addProgress}
                  disabled={m.progress >= 100}
                  className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-30 transition-colors"
                >
                  +10%
                </button>
                <button
                  onClick={markComplete}
                  disabled={m.status === 'done'}
                  className="text-xs px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 disabled:opacity-30 transition-colors"
                >
                  Mark complete
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1.5">Notes</p>
            <textarea
              ref={notesRef}
              defaultValue={m.notes ?? ''}
              onBlur={saveNotes}
              rows={2}
              placeholder="Add a note…"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-neutral-600 resize-none transition-colors"
            />
          </div>
        </div>
      )}
    </li>
  )
}
