import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const message: string = body.message ?? ''

  if (!message.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  // Fetch current state to give Claude context for matching
  const [{ data: ventures }, { data: milestones }, { data: blockers }] = await Promise.all([
    supabase.from('ventures').select('id, name, status').order('name'),
    supabase
      .from('milestones')
      .select('id, title, status, progress, venture_id, ventures(name)')
      .neq('status', 'done')
      .neq('status', 'cancelled')
      .order('due_date', { ascending: true, nullsFirst: false }),
    supabase
      .from('blockers')
      .select('id, title, severity, status, venture_id, ventures(name)')
      .neq('status', 'resolved'),
  ])

  const ventureList = (ventures ?? []).map(v => `${v.id} | ${v.name} (${v.status})`)
  const milestoneList = (milestones ?? []).map(m => {
    const vName = (m as unknown as { ventures?: { name: string } }).ventures?.name ?? 'unknown'
    return `${m.id} | ${vName}: ${m.title} [${m.status}, ${m.progress ?? 0}%]`
  })
  const blockerList = (blockers ?? []).map(b => {
    const vName = (b as unknown as { ventures?: { name: string } }).ventures?.name ?? 'unknown'
    return `${b.id} | ${vName}: ${b.title} [${b.severity}, ${b.status}]`
  })

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const systemPrompt = `You are the ops brain for a solo founder running a small software portfolio. Today is ${today}.

Your job is to interpret a natural-language update from the founder and translate it into precise database changes.

## Current State

### Ventures
${ventureList.length > 0 ? ventureList.join('\n') : 'None'}

### Open Milestones (not done/cancelled)
${milestoneList.length > 0 ? milestoneList.join('\n') : 'None'}

### Open Blockers (not resolved)
${blockerList.length > 0 ? blockerList.join('\n') : 'None'}

## Rules
- Match the founder's words to the closest existing record by name/title similarity
- Only update records that are clearly referenced — never guess at records that aren't mentioned
- Valid milestone changes: status (pending/in_progress/done/cancelled), progress (0-100)
  - Setting status to "done" should also set progress to 100
  - Setting status to "pending" should set progress to 0
- Valid blocker changes: status (open/in_progress/resolved), next_action (string)
  - Setting status to "resolved" is final
- If the update is ambiguous or nothing matches, set updates to an empty array and explain in "understood"
- Be concise in "understood" — one sentence describing what you interpreted`

  const result = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: message }],
    tools: [
      {
        name: 'apply_updates',
        description: 'Apply the interpreted updates to the database',
        input_schema: {
          type: 'object' as const,
          properties: {
            understood: {
              type: 'string',
              description: 'One sentence: what you understood from the message',
            },
            updates: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['milestone', 'blocker'] },
                  id: { type: 'string', description: 'UUID of the record to update' },
                  changes: {
                    type: 'object',
                    description: 'Fields to update (status, progress, next_action, etc.)',
                  },
                },
                required: ['type', 'id', 'changes'],
              },
            },
            activity_note: {
              type: 'string',
              description: 'A concise human-readable activity log entry (past tense)',
            },
          },
          required: ['understood', 'updates', 'activity_note'],
        },
      },
    ],
    tool_choice: { type: 'auto' },
  })

  // Extract tool call result
  const toolUse = result.content.find(b => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    // Claude didn't use the tool — return whatever text it said
    const textBlock = result.content.find(b => b.type === 'text')
    return NextResponse.json({
      summary: textBlock && textBlock.type === 'text'
        ? textBlock.text
        : 'Could not interpret the update.',
      changes: 0,
    })
  }

  const { understood, updates, activity_note } = toolUse.input as {
    understood: string
    updates: Array<{ type: 'milestone' | 'blocker'; id: string; changes: Record<string, unknown> }>
    activity_note: string
  }

  if (!updates || updates.length === 0) {
    return NextResponse.json({ summary: understood, changes: 0 })
  }

  // Apply each update
  const errors: string[] = []
  for (const u of updates) {
    const table = u.type === 'milestone' ? 'milestones' : 'blockers'
    const changes = {
      ...u.changes,
      updated_at: new Date().toISOString(),
      // Auto-set resolved_at for blockers being resolved
      ...(u.type === 'blocker' && u.changes.status === 'resolved'
        ? { resolved_at: new Date().toISOString() }
        : {}),
    }
    const { error } = await supabase.from(table).update(changes).eq('id', u.id)
    if (error) errors.push(`${u.type} ${u.id}: ${error.message}`)
  }

  // Log to activity_log (best effort — don't fail the request if this errors)
  if (activity_note) {
    await supabase.from('activity_log').insert({
      entity_type: 'ops_update',
      action: 'updated',
      note: activity_note,
    }).then(() => {})
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { summary: understood, changes: updates.length - errors.length, errors },
      { status: 207 }
    )
  }

  return NextResponse.json({ summary: understood, changes: updates.length })
}
