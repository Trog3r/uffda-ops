import { createClient } from '@/lib/supabase/server'
import type { Milestone } from '@/lib/types'
import Badge, { statusVariant } from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'

export default async function MilestonesPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('milestones')
    .select('*, ventures(name, color)')
    .order('due_date', { ascending: true, nullsFirst: false })

  const milestones = (data ?? []) as Milestone[]

  function formatDate(d: string | null) {
    if (!d) return '—'
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Milestones</h1>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg overflow-hidden">
        {milestones.length === 0 ? (
          <EmptyState message="No milestones yet" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Venture</th>
                <th className="text-left px-4 py-3 font-medium">Due</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {milestones.map(m => (
                <tr key={m.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-4 py-3 text-neutral-200">{m.title}</td>
                  <td className="px-4 py-3">
                    {m.ventures ? (
                      <span className="text-neutral-400">{m.ventures.name}</span>
                    ) : (
                      <span className="text-neutral-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{formatDate(m.due_date)}</td>
                  <td className="px-4 py-3">
                    <Badge label={m.status.replace('_', ' ')} variant={statusVariant(m.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
