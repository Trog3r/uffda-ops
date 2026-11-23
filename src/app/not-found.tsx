'use client'

// Any URL that matches no route lands here (with a 404 status). Show a friendly
// "Uff da!" note with the path they tried, then send them home after 5 seconds.
// "Stay here" cancels the countdown.
import { useEffect, useState } from 'react'

const C = {
  bg: '#020617', card: '#0F172A', border: '#1E293B', text: '#CBD5E1', strong: '#F1F5F9', muted: '#94A3B8',
  accent: '#F97316', onAccent: '#020617', codeBg: 'rgba(249,115,22,0.12)', codeFg: '#F97316',
  heading: "inherit",
}

export default function NotFound() {
  const [left, setLeft] = useState(5)
  const [staying, setStaying] = useState(false)
  const [path, setPath] = useState('')

  useEffect(() => { setPath(window.location.pathname) }, [])

  useEffect(() => {
    if (staying) return
    if (left <= 0) { window.location.replace('/'); return }
    const t = setTimeout(() => setLeft(n => n - 1), 1000)
    return () => clearTimeout(t)
  }, [left, staying])

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: C.bg, color: C.text }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center', background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '40px 28px' }}>
        <h1 style={{ fontFamily: C.heading, fontSize: '2.6rem', fontWeight: 900, color: C.strong, lineHeight: 1.05, margin: '0 0 12px' }}>Uff da!</h1>
        <p style={{ lineHeight: 1.6, margin: '0 0 12px' }}>
          This page took a wrong turn somewhere around Lakeland.
          {path && <> We couldn&apos;t find <code style={{ background: C.codeBg, color: C.codeFg, padding: '2px 6px', borderRadius: 4, wordBreak: 'break-all' }}>{path}</code>.</>}
        </p>
        <p aria-live="polite" style={{ color: C.muted, fontSize: '0.95rem', minHeight: '1.6em', margin: '0 0 12px' }}>
          {staying ? "Okay, we'll wait right here." : `Steering you back home in ${left}...`}
        </p>
        <a href="/" style={{ display: 'inline-block', marginTop: 12, background: C.accent, color: C.onAccent, fontWeight: 700, padding: '12px 24px', borderRadius: 10, textDecoration: 'none' }}>
          Take me home now
        </a>
        {!staying && (
          <button type="button" onClick={() => setStaying(true)} style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 0, color: C.muted, textDecoration: 'underline', cursor: 'pointer', font: 'inherit', fontSize: '0.9rem' }}>
            Stay here
          </button>
        )}
      </div>
    </main>
  )
}
