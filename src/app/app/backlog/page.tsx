import { createClient } from '@/lib/supabase/server'
import type { BacklogItem } from '@/lib/types'
import Badge, { statusVariant } from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'

const priorityVariant = (p: string) =>
  p === 'high' ? 'warning' : p === 'medium' ? 'info' : 'muted'

export default async function BacklogPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('backlog_items')
    .select('*, ventures(name, color)')
    .order('priority')
    .order('created_at', { ascending: false })

  const items = (data ?? []) as BacklogItem[]

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Backlog</h1>
      </div>

      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg overflow-hidden">
        {items.length === 0 ? (
          <EmptyState message="Backlog is empty" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Venture</th>
                <th className="text-left px-4 py-3 font-medium">Priority</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-4 py-3 text-neutral-200">{item.title}</td>
                  <td className="px-4 py-3">
                    {item.ventures ? (
                      <span className="text-neutral-400">{item.ventures.name}</span>
                    ) : (
                      <span className="text-neutral-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={item.priority} variant={priorityVariant(item.priority)} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={item.status.replace('_', ' ')} variant={statusVariant(item.status)} />
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
