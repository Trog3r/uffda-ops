-- ============================================================
-- SCHEMA
-- ============================================================

create extension if not exists "uuid-ossp";

-- Ventures
create table ventures (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  status      text not null default 'active'
                check (status in ('active', 'paused', 'archived')),
  url         text,
  color       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Milestones
create table milestones (
  id          uuid primary key default uuid_generate_v4(),
  venture_id  uuid references ventures(id) on delete cascade,
  title       text not null,
  description text,
  due_date    date,
  status      text not null default 'pending'
                check (status in ('pending', 'in_progress', 'done', 'cancelled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Blockers
create table blockers (
  id          uuid primary key default uuid_generate_v4(),
  venture_id  uuid references ventures(id) on delete cascade,
  title       text not null,
  description text,
  severity    text not null default 'medium'
                check (severity in ('low', 'medium', 'high', 'critical')),
  status      text not null default 'open'
                check (status in ('open', 'in_progress', 'resolved')),
  resolved_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Backlog items
create table backlog_items (
  id          uuid primary key default uuid_generate_v4(),
  venture_id  uuid references ventures(id) on delete cascade,
  title       text not null,
  description text,
  priority    text not null default 'medium'
                check (priority in ('low', 'medium', 'high')),
  status      text not null default 'backlog'
                check (status in ('backlog', 'in_progress', 'done', 'cancelled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Activity log (append-only)
create table activity_log (
  id          uuid primary key default uuid_generate_v4(),
  venture_id  uuid references ventures(id) on delete set null,
  entity_type text,
  entity_id   uuid,
  action      text not null,
  note        text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index on milestones (venture_id, status);
create index on blockers (venture_id, status);
create index on backlog_items (venture_id, status);
create index on activity_log (venture_id, created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ventures_updated_at      before update on ventures      for each row execute function set_updated_at();
create trigger milestones_updated_at    before update on milestones    for each row execute function set_updated_at();
create trigger blockers_updated_at      before update on blockers      for each row execute function set_updated_at();
create trigger backlog_items_updated_at before update on backlog_items for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table ventures      enable row level security;
alter table milestones    enable row level security;
alter table blockers      enable row level security;
alter table backlog_items enable row level security;
alter table activity_log  enable row level security;

create policy "authenticated full access" on ventures      for all using (auth.uid() is not null);
create policy "authenticated full access" on milestones    for all using (auth.uid() is not null);
create policy "authenticated full access" on blockers      for all using (auth.uid() is not null);
create policy "authenticated full access" on backlog_items for all using (auth.uid() is not null);
create policy "authenticated full access" on activity_log  for all using (auth.uid() is not null);

-- ============================================================
-- SEED DATA
-- ============================================================
insert into ventures (id, name, description, status, url, color) values
  ('11111111-0000-0000-0000-000000000001', 'Uffda Motors',     'Auto repair and dealership — physical shop operations',          'active', null,                         '#ef4444'),
  ('11111111-0000-0000-0000-000000000002', 'Uffda Software',   'Software tools for mechanics and fleet operators',               'active', 'https://uffdasoftware.com',  '#6366f1'),
  ('11111111-0000-0000-0000-000000000003', 'Fleet',            'Fleet management app for Turo hosts and maintenance tracking',   'active', null,                         '#0ea5e9'),
  ('11111111-0000-0000-0000-000000000004', 'SMS Demo',         'Simple shop management system for independent mechanics',        'active', null,                         '#f59e0b'),
  ('11111111-0000-0000-0000-000000000005', 'Uffda Foundation', 'Future nonprofit for low-cost vehicle repair and education',     'active', null,                         '#10b981');

insert into milestones (venture_id, title, due_date, status) values
  ('11111111-0000-0000-0000-000000000001', 'Sign shop lease',                        '2026-05-01', 'in_progress'),
  ('11111111-0000-0000-0000-000000000001', 'Complete business entity setup',         '2026-04-30', 'pending'),
  ('11111111-0000-0000-0000-000000000002', 'Launch ops.uffdasoftware.com v1',        '2026-04-15', 'in_progress'),
  ('11111111-0000-0000-0000-000000000003', 'Ship Fleet app MVP',                     '2026-06-01', 'pending'),
  ('11111111-0000-0000-0000-000000000004', 'Complete SMS Demo for first test shop',  '2026-05-15', 'pending'),
  ('11111111-0000-0000-0000-000000000005', 'File nonprofit paperwork',               null,         'pending');

insert into blockers (venture_id, title, severity, status) values
  ('11111111-0000-0000-0000-000000000001', 'Shop lease not signed yet',                 'critical', 'open'),
  ('11111111-0000-0000-0000-000000000001', 'Business entity not finalized',             'high',     'open'),
  ('11111111-0000-0000-0000-000000000002', 'Need Supabase prod project configured',     'medium',   'open'),
  ('11111111-0000-0000-0000-000000000003', 'No Turo API access confirmed yet',          'high',     'open');

insert into backlog_items (venture_id, title, priority, status) values
  ('11111111-0000-0000-0000-000000000001', 'Research insurance requirements for shop',  'high',   'backlog'),
  ('11111111-0000-0000-0000-000000000001', 'Draft shop operating procedures',           'medium', 'backlog'),
  ('11111111-0000-0000-0000-000000000002', 'Add inline editing to all tables',          'medium', 'backlog'),
  ('11111111-0000-0000-0000-000000000003', 'Build vehicle maintenance timeline view',   'high',   'backlog'),
  ('11111111-0000-0000-0000-000000000004', 'Create demo environment with sample data',  'high',   'backlog'),
  ('11111111-0000-0000-0000-000000000005', 'Research 501(c)(3) filing requirements',    'low',    'backlog');

insert into activity_log (venture_id, entity_type, action, note) values
  ('11111111-0000-0000-0000-000000000002', 'venture',  'created',  'Ops dashboard project initialized'),
  ('11111111-0000-0000-0000-000000000001', 'blocker',  'created',  'Opened blocker: Shop lease not signed yet'),
  ('11111111-0000-0000-0000-000000000003', 'venture',  'created',  'Fleet app added to ops tracker'),
  ('11111111-0000-0000-0000-000000000004', 'venture',  'created',  'SMS Demo added to ops tracker');
