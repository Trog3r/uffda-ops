'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SignOutButton from './SignOutButton'

const navItems = [
  { label: 'Dashboard',  href: '/app/dashboard' },
  { label: 'Milestones', href: '/app/milestones' },
  { label: 'Blockers',   href: '/app/blockers' },
  { label: 'Backlog',    href: '/app/backlog' },
  { label: 'Settings',   href: '/app/settings' },
]

interface SidebarProps {
  userEmail: string | null
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-[#030d1e] border-r border-white/5 h-screen sticky top-0">

      {/* Wordmark */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <img
            src="/brand/favicon-96x96.png"
            alt=""
            className="w-7 h-7 rounded-lg"
          />
          <div>
            <p className="text-sm font-semibold text-white leading-tight tracking-tight">Uffda Ops</p>
            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Operations Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-cyan-950/50 text-cyan-300 font-medium'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              {active && (
                <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
              )}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        {userEmail && (
          <p className="text-[11px] text-slate-600 mb-2.5 truncate">{userEmail}</p>
        )}
        <SignOutButton />
      </div>
    </aside>
  )
}
