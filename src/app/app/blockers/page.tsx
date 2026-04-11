import { createClient } from '@/lib/supabase/server'
import type { Blocker, Venture, BlockerSeverity } from '@/lib/types'
import BlockerItem from '@/components/dashboard/BlockerItem'
import NewBlockerForm from '@/components/dashboard/NewBlockerForm'
import EmptyState from '@/components/ui/EmptyState'
import NewBlockerToggle from '@/components/dashboard/NewBlockerToggle'

const SEVERITY_ORDER: Record<BlockerSeverity, number> = {
  critical: 4, high: 3, medium: 2, low: 1,
}

export default async function BlockersPage() {
  const supabase = await createClient()

  const [{ data: blockerData }, { data: ventureData }] = await Promise.all([
    supabase
      .from('blockers')
      .select('*, ventures(name, color)')
      .order('status')
      .order('severity'),
    supabase.from('ventures').select('id, name').eq('status', 'active').order('name'),
  ])

  const all = (blockerData ?? []) as Blocker[]
  const ventures = (ventureData ?? []) as Pick<Venture, 'id' | 'name'>[]

  const open = all
    .filter(b => b.status !== 'resolved')
    .sort((a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity])
  const resolved = all.filter(b => b.status === 'resolved')

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Blockers</h1>
          <p className="text-sm text-slate-500 mt-0.5">{open.length} open · {resolved.length} resolved</p>
        </div>
        <NewBlockerToggle ventures={ventures} />
      </div>

      {/* Open blockers */}
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg overflow-hidden mb-6">
        {open.length === 0 ? (
          <EmptyState message="No open blockers" />
        ) : (
          <ul>
            {open.map(b => <BlockerItem key={b.id} blocker={b} />)}
          </ul>
        )}
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <h2 className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">Resolved</h2>
          <div className="bg-[#111] border border-neutral-800/60 rounded-lg overflow-hidden opacity-50">
            <ul>
              {resolved.map(b => (
                <li key={b.id} className="px-4 py-2.5 border-b border-neutral-800 last:border-0 flex items-center gap-3">
                  <span className="text-xs text-neutral-600 line-through">{b.title}</span>
                  {b.ventures && <span className="text-xs text-neutral-700">{b.ventures.name}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
