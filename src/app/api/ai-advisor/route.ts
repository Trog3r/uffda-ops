import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { FOUNDER_CONTEXT } from '@/lib/founder-context'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [
    { data: ventures },
    { data: openBlockers },
    { data: milestones },
    { data: activity },
  ] = await Promise.all([
    supabase.from('ventures').select('*').order('name'),
    supabase.from('blockers').select('*, ventures(name)').eq('status', 'open').order('severity'),
    supabase
      .from('milestones')
      .select('*, ventures(name)')
      .neq('status', 'done')
      .neq('status', 'cancelled')
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(10),
    supabase
      .from('activity_log')
      .select('*, ventures(name)')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const prompt = `You are a sharp, no-nonsense ops advisor for a solo founder. Today is ${today}.

${FOUNDER_CONTEXT}

---

## Live Ops Snapshot

### Active Ventures
${(ventures ?? []).filter(v => v.status === 'active').map(v => `- ${v.name}${v.description ? `: ${v.description}` : ''}`).join('\n') || 'None recorded'}

### Paused / Archived Ventures
${(ventures ?? []).filter(v => v.status !== 'active').map(v => `- ${v.name} (${v.status})`).join('\n') || 'None recorded'}

### Open Blockers
${(openBlockers ?? []).map(b => `- [${b.severity}] ${(b as { ventures?: { name: string } }).ventures?.name ?? 'general'}: ${b.title}${b.description ? ` — ${b.description}` : ''}`).join('\n') || 'None recorded — do not assume there are no blockers, data may not be logged yet'}

### Upcoming Milestones
${(milestones ?? []).map(m => `- ${(m as { ventures?: { name: string } }).ventures?.name ?? 'general'}: ${m.title}${m.due_date ? ` (due ${m.due_date})` : ' (no due date)'} [${m.status}]`).join('\n') || 'None recorded — do not assume no milestones exist'}

### Recent Activity (last 20 events)
${(activity ?? []).map(a => `- ${(a as { ventures?: { name: string } }).ventures?.name ?? 'general'}: ${a.action}${a.note ? ` — ${a.note}` : ''}`).join('\n') || 'None recorded'}

---

Based on this snapshot and the founder context above, give me a tight founder ops brief.

## Rules you must follow:
1. Do not recommend forming a business entity if a venture is already marked as active — Uffda Motors LLC exists, Uffda Software is a DBA, they do not need to be formed.
2. Base recommendations on actual blocker and milestone data. If no blockers are logged, do not invent them — but do note if data appears sparse.
3. If a recommendation depends on information that is missing or unclear, explicitly name what is unknown rather than filling in a guess.
4. Absence of logged data means "unknown", not "not started" or "no progress".
5. Uffda Foundation is not an operating priority. Do not recommend actions for it.
6. The shop (repair work) is the fastest path to near-term revenue — weight recommendations accordingly.

Respond with a JSON object with exactly these keys:
- "top_priorities": A numbered list (1-3) of the most important things to focus on right now, one per line
- "biggest_blocker": The single most critical thing standing in the way of progress, based on logged data and known context
- "fastest_path_to_revenue": The most actionable thing to do to move money, grounded in what is actually in motion
- "what_can_wait": What is safe to deprioritize or ignore right now
- "suggested_next_action": One specific concrete action to take today

Keep each field to 1-3 sentences max. Be a trusted advisor, not a consultant. Be direct.`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
  }

  let parsed: {
    top_priorities: string
    biggest_blocker: string
    fastest_path_to_revenue: string
    what_can_wait: string
    suggested_next_action: string
  }

  try {
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }

  const { data: saved, error: saveError } = await supabase
    .from('ai_recommendations')
    .insert(parsed)
    .select()
    .single()

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 })
  }

  return NextResponse.json(saved)
}
