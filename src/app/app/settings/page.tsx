import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold text-white mb-8">Settings</h1>

      <div className="space-y-6">
        <section className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Email</span>
              <span className="text-neutral-300">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">User ID</span>
              <span className="text-neutral-600 font-mono text-xs">{user?.id}</span>
            </div>
          </div>
        </section>

        <section className="bg-[#1a1a1a] border border-neutral-800 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-white mb-1">About</h2>
          <p className="text-sm text-neutral-500">
            Uffda Ops — private founder operating system. v1.
          </p>
        </section>
      </div>
    </div>
  )
}
