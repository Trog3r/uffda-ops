import { createClient } from '@/lib/supabase/server'
import type { Venture, Milestone, Blocker, ActivityLog } from '@/lib/types'
import VentureCard from '@/components/dashboard/VentureCard'
import BlockersList from '@/components/dashboard/BlockersList'
import MilestonesList from '@/components/dashboard/MilestonesList'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import OpsAdvisor from '@/components/dashboard/OpsAdvisor'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { data: ventures },
    { data: openBlockers },
    { data: upcomingMilestones },
    { data: activity },
    { data: latestRec },
  ] = await Promise.all([
    supabase.from('ventures').select('*').order('name'),
    supabase.from('blockers').select('*, ventures(name, color)').eq('status', 'open').order('severity'),
    supabase.from('milestones')
      .select('*, ventures(name, color)')
      .neq('status', 'done')
      .neq('status', 'cancelled')
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(8),
    supabase.from('activity_log')
      .select('*, ventures(name, color)')
      .order('created_at', { ascending: false })
      .limit(15),
    supabase.from('ai_recommendations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const ventureList = (ventures ?? []) as Venture[]
  const blockerList = (openBlockers ?? []) as Blocker[]
  const milestoneList = (upcomingMilestones ?? []) as Milestone[]
  const activityList = (activity ?? []) as ActivityLog[]

  // Derive per-venture stats
  const blockerCountByVenture: Record<string, number> = {}
  blockerList.forEach(b => {
    if (b.venture_id) {
      blockerCountByVenture[b.venture_id] = (blockerCountByVenture[b.venture_id] ?? 0) + 1
    }
  })

  const nextMilestoneByVenture: Record<string, Milestone> = {}
  milestoneList.forEach(m => {
    if (m.venture_id && !nextMilestoneByVenture[m.venture_id]) {
      nextMilestoneByVenture[m.venture_id] = m
    }
  })

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Venture grid */}
      <section className="mb-8">
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Ventures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ventureList.map(venture => (
            <VentureCard
              key={venture.id}
              venture={venture}
              openBlockerCount={blockerCountByVenture[venture.id] ?? 0}
              nextMilestone={nextMilestoneByVenture[venture.id] ?? null}
            />
          ))}
        </div>
      </section>

      {/* Blockers + Milestones */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <BlockersList blockers={blockerList} />
        <MilestonesList milestones={milestoneList} />
      </section>

      {/* Ops Advisor */}
      <section className="mb-4">
        <OpsAdvisor latest={latestRec ?? null} />
      </section>

      {/* Activity feed */}
      <section>
        <ActivityFeed activity={activityList} />
      </section>
    </div>
  )
}
