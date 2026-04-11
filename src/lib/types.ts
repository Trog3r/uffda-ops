export type VentureStatus = 'active' | 'paused' | 'archived'
export type MilestoneStatus = 'pending' | 'in_progress' | 'done' | 'cancelled'
export type BlockerStatus = 'open' | 'in_progress' | 'resolved'
export type BlockerSeverity = 'low' | 'medium' | 'high' | 'critical'
export type BacklogStatus = 'backlog' | 'in_progress' | 'done' | 'cancelled'
export type BacklogPriority = 'low' | 'medium' | 'high'

export interface Venture {
  id: string
  name: string
  description: string | null
  status: VentureStatus
  url: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: string
  venture_id: string | null
  title: string
  description: string | null
  due_date: string | null
  status: MilestoneStatus
  created_at: string
  updated_at: string
  ventures?: { name: string; color: string | null }
}

export interface Blocker {
  id: string
  venture_id: string | null
  title: string
  description: string | null
  severity: BlockerSeverity
  status: BlockerStatus
  resolved_at: string | null
  created_at: string
  updated_at: string
  ventures?: { name: string; color: string | null }
}

export interface BacklogItem {
  id: string
  venture_id: string | null
  title: string
  description: string | null
  priority: BacklogPriority
  status: BacklogStatus
  created_at: string
  updated_at: string
  ventures?: { name: string; color: string | null }
}

export interface ActivityLog {
  id: string
  venture_id: string | null
  entity_type: string | null
  entity_id: string | null
  action: string
  note: string | null
  created_at: string
  ventures?: { name: string; color: string | null }
}
