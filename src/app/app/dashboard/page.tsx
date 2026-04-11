import { createClient } from '@/lib/supabase/server'
import type { Venture, Milestone, Blocker, ActivityLog, BlockerSeverity } from '@/lib/types'
import VentureCard from '@/components/dashboard/VentureCard'
import BlockersList from '@/components/dashboard/BlockersList'
import MilestonesList from '@/components/dashboard/MilestonesList'
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
  // Sort blockers: critical first
  const blockerList = ((openBlockers ?? []) as Blocker[]).sort(
    (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity]
  )
  const milestoneList = (allMilestones ?? []) as Milestone[]
  const activityList = (activity ?? []) as ActivityLog[]

  // --- Per-venture milestone stats ---
  const milestoneStatsByVenture: Record<string, { total: number; done: number }> = {}
  const openMilestoneCountByVenture: Record<string, number> = {}

  for (const m of milestoneList) {
    if (!m.venture_id) continue
    if (!milestoneStatsByVenture[m.venture_id]) {
      milestoneStatsByVenture[m.venture_id] = { total: 0, done: 0 }
    }
    if (m.status !== 'cancelled') {
      milestoneStatsByVenture[m.venture_id].total++
      if (m.status === 'done') milestoneStatsByVenture[m.venture_id].done++
    }
    if (m.status !== 'done' && m.status !== 'cancelled') {
      openMilestoneCountByVenture[m.venture_id] = (openMilestoneCountByVenture[m.venture_id] ?? 0) + 1
    }
  }

  // --- Per-venture blocker stats ---
  const blockerCountByVenture: Record<string, number> = {}
  const maxSeverityByVenture: Record<string, BlockerSeverity> = {}

  for (const b of blockerList) {
    if (!b.venture_id) continue
    blockerCountByVenture[b.venture_id] = (blockerCountByVenture[b.venture_id] ?? 0) + 1
    const current = maxSeverityByVenture[b.venture_id]
    if (!current || SEVERITY_ORDER[b.severity] > SEVERITY_ORDER[current]) {
      maxSeverityByVenture[b.venture_id] = b.severity
    }
  }

  // --- Next milestone per venture ---
  const nextMilestoneByVenture: Record<string, Milestone> = {}
  for (const m of milestoneList) {
    if (m.venture_id && m.status !== 'done' && m.status !== 'cancelled') {
      if (!nextMilestoneByVenture[m.venture_id]) nextMilestoneByVenture[m.venture_id] = m
    }
  }

  // --- Active milestones for the list (in_progress first, then pending, cap 10) ---
  const activeMilestones = [
    ...milestoneList.filter(m => m.status === 'in_progress'),
    ...milestoneList.filter(m => m.status === 'pending'),
  ].slice(0, 10)

  // --- Momentum stats ---
  const nonCancelled = milestoneList.filter(m => m.status !== 'cancelled')
  const totalMilestones = nonCancelled.length
  const doneMilestones = nonCancelled.filter(m => m.status === 'done').length
  const overallPct = totalMilestones > 0 ? (doneMilestones / totalMilestones) * 100 : 0
  const remainingMilestones = totalMilestones - doneMilestones

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
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
      <section className="mb-6">
        <OpsAdvisor latest={latestRec ?? null} />
      </section>

      {/* Blockers + Milestones */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <BlockersList
          blockers={blockerList}
          openMilestoneCountByVenture={openMilestoneCountByVenture}
          ventures={ventureList.map(v => ({ id: v.id, name: v.name }))}
        />
        <MilestonesList milestones={activeMilestones} />
      </section>

      {/* Venture grid */}
      <section className="mb-6">
        <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Ventures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ventureList.map(venture => (
            <VentureCard
              key={venture.id}
              venture={venture}
              openBlockerCount={blockerCountByVenture[venture.id] ?? 0}
              maxBlockerSeverity={maxSeverityByVenture[venture.id] ?? null}
              nextMilestone={nextMilestoneByVenture[venture.id] ?? null}
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
