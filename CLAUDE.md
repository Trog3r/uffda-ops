@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
```

No test suite. `npm run build` is the primary correctness check.

## Architecture Overview

**Uffda Software Ops** is a single-founder operations dashboard built on Next.js 16 (App Router) + Supabase + TypeScript + Tailwind v4. It tracks ventures, milestones, blockers, and backlog across the portfolio, and generates AI advisory briefs via Claude.

### Request Flow

1. `proxy.ts` — middleware that guards all `/app/*` routes. Redirects unauthenticated users to `/`, authenticated users visiting `/` to `/app/dashboard`.
2. `src/app/app/layout.tsx` — wraps protected routes in the sidebar shell.
3. Pages — all data fetched server-side via `lib/supabase/server.ts`; mutations use `lib/supabase/client.ts` + `router.refresh()`.

### Route Structure

| Route | Purpose |
|-------|---------|
| `/` | Login (redirects to dashboard if authenticated) |
| `/auth/callback` | OAuth/magic link exchange |
| `/auth/forgot-password` | Password reset request |
| `/auth/reset-password` | New password form |
| `/app/dashboard` | Main view: momentum bar, AI brief, blockers, milestones, ventures, activity feed |
| `/app/milestones` | All milestones grouped by status |
| `/app/blockers` | All blockers + new blocker form |
| `/app/backlog` | Backlog items by venture |
| `/app/settings` | Account info |

### Key Files

| File | Purpose |
|------|---------|
| `lib/types.ts` | All TypeScript types: `Venture`, `Milestone`, `Blocker`, `BacklogItem`, `ActivityLog` |
| `lib/founder-context.ts` | Static context string injected into every AI prompt |
| `lib/supabase/client.ts` | Browser client (`createBrowserClient` from `@supabase/ssr`) |
| `lib/supabase/server.ts` | Server client (cookie-based, safe for Server Components) |
| `proxy.ts` | Auth middleware — note: named `proxy.ts`, not `middleware.ts` |

### Two Supabase Clients

- `lib/supabase/client.ts` — browser client, used in client components for mutations
- `lib/supabase/server.ts` — server client, used in Server Components for data fetching

No admin/service role client. RLS policy is "authenticated full access" — any logged-in user reads and writes all records. Suitable for single-founder use only.

### AI Endpoint (`app/api/ai-advisor/route.ts`)

- **Model:** `claude-opus-4-6` with adaptive thinking (`thinking: { type: 'adaptive' }`)
- **Flow:** Validates auth → fetches live ops snapshot → constructs prompt with `FOUNDER_CONTEXT` + snapshot → calls Claude → parses JSON → stores in `ai_recommendations` table → returns saved record
- **Response shape:** `{ top_priorities, biggest_blocker, fastest_path_to_revenue, what_can_wait, suggested_next_action }`
- **API key:** `ANTHROPIC_API_KEY` — server-only, never exposed to client
- Adaptive thinking means Claude may spend significant tokens on reasoning before responding; this is intentional

### Database Tables

| Table | Purpose |
|-------|---------|
| `ventures` | Top-level business entities (name, status, color) |
| `milestones` | Trackable goals per venture (status, progress %, notes) |
| `blockers` | Impediments with severity (critical/high/medium/low) |
| `backlog_items` | Queued work items per venture |
| `activity_log` | Immutable event feed (last 15 shown on dashboard) |
| `ai_recommendations` | Stored AI brief records (append-only) |

### Styling (Tailwind v4)

Tailwind v4 uses a different syntax than v3 — no `tailwind.config.js`. Configuration is done via `@theme` in `globals.css`:

```css
@import "tailwindcss";   /* NOT @tailwind base/components/utilities */

@theme {
  --color-action:   #F97316;
  --color-progress: #22D3EE;
}
```

Color scheme is **dark mode only** — `#020617` background, neutral grays for text, orange/cyan for brand accents. There is no light mode toggle in this app.

## Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon key |
| `ANTHROPIC_API_KEY` | Server-only | Claude API key |

## Deployment

- Vercel, auto-deploys on push to main
- Node 24 required (set in `.nvmrc`)
- No staging environment

## Patterns & Gotchas

- **Middleware is `proxy.ts`**, not `middleware.ts` — Next.js picks it up by convention either way, but don't rename it
- **No token refresh in middleware** — browser client owns refresh via `autoRefreshToken: true`; middleware is intentionally passive to avoid token rotation race conditions
- **Mutations + `router.refresh()`** — client components mutate via `supabase.from(...).update/insert`, then call `router.refresh()` to re-run server data fetches; no global state management
- **Optimistic updates** — `MilestoneRow` and `BlockerItem` update local state immediately and revert on error
- **Autosave on blur** — milestone notes save when the input loses focus
- Tailwind v4 `@import "tailwindcss"` replaces the old `@tailwind` directives — using the old syntax will break the build
- Path alias: `@/*` → `./src/*`
