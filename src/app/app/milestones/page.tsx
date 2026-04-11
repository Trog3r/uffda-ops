import { createClient } from '@/lib/supabase/server'
import type { Milestone } from '@/lib/types'
import MilestoneRow from '@/components/dashboard/MilestoneRow'
import EmptyState from '@/components/ui/EmptyState'

export default async function MilestonesPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('milestones')
    .select('*, ventures(name, color)')
    .order('status')
    .order('due_date', { ascending: true, nullsFirst: false })

  const milestones = (data ?? []) as Milestone[]

  const groups = [
    { label: 'In Progress', items: milestones.filter(m => m.status === 'in_progress') },
    { label: 'Not Started',  items: milestones.filter(m => m.status === 'pending') },
    { label: 'Done',         items: milestones.filter(m => m.status === 'done') },
    { label: 'Cancelled',    items: milestones.filter(m => m.status === 'cancelled') },
  ].filter(g => g.items.length > 0)

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Milestones</h1>
        <p className="text-sm text-slate-500 mt-0.5">Click any row to update status, progress, or notes</p>
      </div>

      {milestones.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg">
          <EmptyState message="No milestones yet" />
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group.label}>
              <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                {group.label} <span className="text-slate-700">({group.items.length})</span>
              </h2>
              <div className="bg-[#1a1a1a] border border-neutral-800 rounded-lg overflow-hidden">
                <ul>
                  {group.items.map(m => (
                    <MilestoneRow key={m.id} milestone={m} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
