'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/app/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Reset password</h1>
          <p className="mt-1 text-sm text-neutral-500">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-md bg-[#1a1a1a] border border-neutral-700 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-md bg-[#1a1a1a] border border-neutral-700 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-orange-500 text-white font-semibold text-sm py-2.5 hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
