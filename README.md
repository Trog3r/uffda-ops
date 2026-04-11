# Uffda Ops

Private internal operations dashboard for the Uffda portfolio of ventures.

**Stack:** Next.js 16 (App Router) · Supabase (auth + DB) · Tailwind v4 · Vercel

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
```

Both values are in your Supabase project under **Project Settings → API**.

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
4. Add the two env vars in **Project Settings → Environment Variables**
5. Deploy — Vercel handles the rest

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Login page (public) |
| `/app/dashboard` | Venture cards, blockers, milestones, activity |
| `/app/milestones` | All milestones |
| `/app/blockers` | All blockers |
| `/app/backlog` | Backlog items |
| `/app/settings` | Account info |

All `/app/*` routes require authentication. Unauthenticated visitors are redirected to `/`.
