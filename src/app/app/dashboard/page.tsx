import { createClient } from '@/lib/supabase/server'
import type { Venture, Milestone, Blocker, ActivityLog, BlockerSeverity } from '@/lib/types'
import VentureStoryCard from '@/components/dashboard/VentureStoryCard'
import OpsUpdateInput from '@/components/dashboard/OpsUpdateInput'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import OpsAdvisor from '@/components/dashboard/OpsAdvisor'
import MomentumBar from '@/components/dashboard/MomentumBar'

const SEVERITY_ORDER: Record<BlockerSeverity, number> = {
  critical: 4, high: 3, medium: 2, low: 1,
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { data: ventures },
    { data: openBlockers },
    { data: allMilestones },
    { data: activity },
    { data: latestRec },
  ] = await Promise.all([
    supabase.from('ventures').select('*').order('name'),
    supabase
      .from('blockers')
      .select('*, ventures(name, color)')
      .neq('status', 'resolved')
      .order('severity'),
    supabase
      .from('milestones')
      .select('*, ventures(name, color)')
      .order('due_date', { ascending: true, nullsFirst: false }),
    supabase
      .from('activity_log')
      .select('*, ventures(name, color)')
      .order('created_at', { ascending: false })
      .limit(15),
    supabase
      .from('ai_recommendations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const ventureList = (ventures ?? []) as Venture[]
  const blockerList = ((openBlockers ?? []) as Blocker[]).sort(
    (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]
  )
  const milestoneList = (allMilestones ?? []) as Milestone[]
  const activityList = (activity ?? []) as ActivityLog[]

  // --- Per-venture milestone stats ---
  const milestoneStatsByVenture: Record<string, { total: number; done: number }> = {}
  for (const m of milestoneList) {
    if (!m.venture_id) continue
    if (!milestoneStatsByVenture[m.venture_id]) {
      milestoneStatsByVenture[m.venture_id] = { total: 0, done: 0 }
    }
    if (m.status !== 'cancelled') {
      milestoneStatsByVenture[m.venture_id].total++
      if (m.status === 'done') milestoneStatsByVenture[m.venture_id].done++
    }
  }

  // --- Current milestone per venture (in_progress first, then earliest pending) ---
  const currentMilestoneByVenture: Record<string, Milestone> = {}
  for (const m of milestoneList) {
    if (!m.venture_id || m.status === 'done' || m.status === 'cancelled') continue
    const existing = currentMilestoneByVenture[m.venture_id]
    if (!existing) {
      currentMilestoneByVenture[m.venture_id] = m
    } else if (m.status === 'in_progress' && existing.status !== 'in_progress') {
      // Prefer in_progress over pending
      currentMilestoneByVenture[m.venture_id] = m
    }
  }

  // --- Blockers per venture ---
  const blockersByVenture: Record<string, Blocker[]> = {}
  for (const b of blockerList) {
    if (!b.venture_id) continue
    if (!blockersByVenture[b.venture_id]) blockersByVenture[b.venture_id] = []
    blockersByVenture[b.venture_id].push(b)
  }

  // --- Momentum stats ---
  const nonCancelled = milestoneList.filter(m => m.status !== 'cancelled')
  const totalMilestones = nonCancelled.length
  const doneMilestones = nonCancelled.filter(m => m.status === 'done').length
  const overallPct = totalMilestones > 0 ? (doneMilestones / totalMilestones) * 100 : 0
  const remainingMilestones = totalMilestones - doneMilestones

  // Active ventures first, then paused, then archived
  const sortedVentures = [...ventureList].sort((a, b) => {
    const order = { active: 0, paused: 1, archived: 2 }
    return (order[a.status] ?? 3) - (order[b.status] ?? 3)
  })

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-600 mt-0.5 uppercase tracking-wider">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <MomentumBar
          overallPct={overallPct}
          remainingMilestones={remainingMilestones}
          activeBlockers={blockerList.length}
          compact
        />
      </div>

      {/* Ops Advisor */}
      <section className="mb-5">
        <OpsAdvisor latest={latestRec ?? null} />
      </section>

      {/* Natural language update input */}
      <section className="mb-6">
        <OpsUpdateInput />
      </section>

      {/* Venture story cards */}
      <section className="mb-6">
        <p className="ops-label mb-3">Ventures</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedVentures.map(venture => (
            <VentureStoryCard
              key={venture.id}
              venture={venture}
              currentMilestone={currentMilestoneByVenture[venture.id] ?? null}
              blockers={blockersByVenture[venture.id] ?? []}
              milestoneStats={milestoneStatsByVenture[venture.id] ?? { total: 0, done: 0 }}
            />
          ))}
        </div>
      </section>

      {/* Activity feed */}
      <section>
        <ActivityFeed activity={activityList} />
      </section>
    </div>
  )
}
