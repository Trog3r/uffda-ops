'use client'

import { useState } from 'react'
import NewBlockerForm from './NewBlockerForm'

interface Venture { id: string; name: string }

interface NewBlockerToggleProps {
  ventures: Venture[]
}

export default function NewBlockerToggle({ ventures }: NewBlockerToggleProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-3 py-1.5 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-400 transition-colors"
      >
        + New Blocker
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-10 w-[480px] bg-[#1a1a1a] border border-neutral-700 rounded-lg shadow-xl shadow-black/40 overflow-hidden">
          <NewBlockerForm ventures={ventures} onDone={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
