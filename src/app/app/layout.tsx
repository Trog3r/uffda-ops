import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/shell/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar userEmail={user.email ?? null} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
