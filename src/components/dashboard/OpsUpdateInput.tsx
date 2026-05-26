'use client'

import { useState, useRef, useTransition, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function OpsUpdateInput() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<{ summary: string; changes: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    if (!value.trim() || isPending) return
    setResult(null)
    setError(null)

    startTransition(async () => {
      try {
        const res = await fetch('/api/ops-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: value.trim() }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error ?? 'Something went wrong')
          return
        }

        setResult({ summary: data.summary, changes: data.changes })
        setValue('')

        if (data.changes > 0) {
          router.refresh()
        }
      } catch {
        setError('Failed to reach the server')
      }
    })
  }

  return (
    <div className="rounded-lg border border-white/[0.07] bg-[#080f1d] px-4 py-3 space-y-2">
      <div className="flex items-center gap-2">
        {/* Pulsing dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          placeholder="What happened? e.g. 'finished the billing setup, Stripe blocker is cleared'"
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
        />

        <button
          onClick={submit}
          disabled={!value.trim() || isPending}
          className="shrink-0 text-xs font-medium px-3 py-1.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? 'Thinking…' : 'Update'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <p className="text-xs pl-4 leading-relaxed">
          {result.changes > 0 ? (
            <span className="text-emerald-400">
              ✓ {result.summary}
            </span>
          ) : (
            <span className="text-slate-500">{result.summary}</span>
          )}
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 pl-4">{error}</p>
      )}
    </div>
  )
}
