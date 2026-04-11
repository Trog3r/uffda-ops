import { createClient } from '@/lib/supabase/server'
import type { Blocker } from '@/lib/types'
import Badge, { statusVariant, severityVariant } from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'

export default async function BlockersPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('blockers')
    .select('*, ventures(name, color)')
    .order('status')
    .order('severity')

  const blockers = (data ?? []) as Blocker[]

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Blockers</h1>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg overflow-hidden">
        {blockers.length === 0 ? (
          <EmptyState message="No blockers" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Venture</th>
                <th className="text-left px-4 py-3 font-medium">Severity</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {blockers.map(b => (
                <tr key={b.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-4 py-3 text-neutral-200">{b.title}</td>
                  <td className="px-4 py-3">
                    {b.ventures ? (
                      <span className="text-neutral-400">{b.ventures.name}</span>
                    ) : (
                      <span className="text-neutral-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={b.severity} variant={severityVariant(b.severity)} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={b.status} variant={statusVariant(b.status)} />
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
