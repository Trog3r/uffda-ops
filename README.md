# Uffda Ops

Private internal operations dashboard for the Uffda portfolio of ventures.

**Stack:** Next.js 16 (App Router) · Supabase (auth + DB) · Tailwind v4 · Vercel · Anthropic Claude

---

## Features

- **Dashboard** — momentum stats (% to revenue, milestones remaining, active blockers), venture cards with health colors and progress bars, open blockers, active milestones, activity feed
- **Ops Advisor** — AI brief powered by `claude-opus-4-6`: top priorities, biggest blocker, fastest path to revenue, what can wait, suggested next action. Pulls live venture/milestone/blocker/activity data. Saved to Supabase on each refresh.
- **Milestone tracking** — inline expand to update status, progress (+10% / mark complete), and notes (autosave on blur)
- **Blocker management** — New Blocker form with severity pills, venture picker, next action field; inline Working / Resolve quick actions
- **Milestones page** — grouped by status (In Progress / Not Started / Done / Cancelled), all interactive
- **Blockers page** — open sorted by severity, resolved shown dimmed below
- **Backlog** — priority-ranked items per venture
- **Brand identity** — `#020617` dark navy background, orange (`#F97316`) for actions/CTAs, teal (`#22D3EE`) for progress/structure; Manrope variable font; noise grain texture; favicon and web app manifest wired up

---

## Setup

### 1. Supabase project

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   ```
   supabase/migrations/0001_initial_schema.sql
   ```
   This creates all tables, RLS policies, and seeds the 5 ventures.

3. In **Authentication → URL Configuration**:
   - Set **Site URL** to your Vercel deployment URL (e.g. `https://ops.uffdasoftware.com`)
   - Add `https://ops.uffdasoftware.com/auth/callback` to **Redirect URLs**
   - For local dev, also add `http://localhost:3000/auth/callback`

4. In **Authentication → Users**, create your account manually (or use the Supabase dashboard to invite yourself).

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=sk-ant-...
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `ANTHROPIC_API_KEY` | Yes | AI Advisor (server-side only, never exposed to browser) |

### 3. Local dev

Requires Node 24. If using nvm: `nvm use 24`

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push this repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Set **Node.js Version** to **24.x** in **Settings → General**
4. Add all three env vars in **Project Settings → Environment Variables**
5. Deploy — Vercel handles the rest

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Login page (public) |
| `/auth/forgot-password` | Request password reset email |
| `/auth/reset-password` | Set new password (after reset link) |
| `/app/dashboard` | Main dashboard — momentum, advisor, blockers, milestones, ventures |
| `/app/milestones` | All milestones grouped by status |
| `/app/blockers` | All blockers with new blocker form |
| `/app/backlog` | Backlog items |
| `/app/settings` | Account info |

All `/app/*` routes require authentication. Unauthenticated visitors are redirected to `/`.

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `ventures` | 5 ventures — Uffda Motors, Uffda Software, Fleet, SMS Demo, Uffda Foundation |
| `milestones` | Milestones per venture; fields: title, status, progress (0–100), notes, due_date |
| `blockers` | Open issues per venture; fields: title, severity, status, next_action, milestone_id |
| `backlog_items` | Prioritized backlog per venture |
| `activity_log` | Audit log of notable events |
| `ai_recommendations` | Saved AI Advisor outputs with timestamp |
