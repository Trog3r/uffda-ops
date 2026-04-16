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
    <aside className="w-[200px] shrink-0 flex flex-col bg-[#030d1e] border-r border-white/[0.06] h-screen sticky top-0">

      {/* Wordmark */}
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <img
            src="/brand/favicon-96x96.png"
            alt=""
            className="w-6 h-6 rounded-md"
          />
          <div>
            <p className="text-sm font-semibold text-white leading-tight tracking-tight">Uffda Ops</p>
            <p className="text-[10px] text-slate-600 leading-tight mt-0.5 uppercase tracking-widest">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 py-2 text-sm transition-colors rounded-r-md
                border-l-2 pl-[10px] pr-3
                ${active
                  ? 'border-l-[#22D3EE] text-white font-medium bg-white/[0.06]'
                  : 'border-l-transparent text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }
              `}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        {userEmail && (
          <p className="text-[10px] text-slate-600 mb-2.5 truncate">{userEmail}</p>
        )}
        <SignOutButton />
      </div>
    </aside>
  )
}
