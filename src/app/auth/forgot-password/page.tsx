'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Check your email</h1>
          <p className="mt-2 text-sm text-neutral-500">
            We sent a reset link to <span className="text-neutral-300">{email}</span>
          </p>
          <Link href="/" className="mt-6 inline-block text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
            ← Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Reset password</h1>
          <p className="mt-1 text-sm text-neutral-500">We&apos;ll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded-md bg-[#1a1a1a] border border-neutral-700 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-orange-500 text-white font-semibold text-sm py-2.5 hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
