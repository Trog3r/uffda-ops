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
    <aside className="w-[220px] shrink-0 flex flex-col bg-[#111111] border-r border-neutral-800 h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-neutral-800">
        <span className="text-sm font-semibold text-white tracking-tight">Uffda Ops</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-neutral-800">
        {userEmail && (
          <p className="text-xs text-neutral-600 mb-2 truncate">{userEmail}</p>
        )}
        <SignOutButton />
      </div>
    </aside>
  )
}
