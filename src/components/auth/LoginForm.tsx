'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/app/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full rounded-md bg-[#1a1a1a] border border-neutral-700 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full rounded-md bg-[#1a1a1a] border border-neutral-700 px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-orange-500 text-white font-semibold text-sm py-2.5 hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center">
        <Link href="/auth/forgot-password" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
          Forgot password?
        </Link>
      </p>
    </form>
  )
}
