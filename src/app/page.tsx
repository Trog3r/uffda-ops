import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-sm">

        {/* Logo + wordmark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img
            src="/brand/web-app-manifest-192x192.png"
            alt="Uffda Ops"
            className="w-16 h-16 rounded-2xl shadow-lg shadow-black/40"
          />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white tracking-tight">Uffda Ops</h1>
            <p className="text-sm text-slate-500 mt-0.5">Private operations dashboard</p>
          </div>
        </div>

        <LoginForm />

        <p className="mt-8 text-center">
          <a
            href="https://uffdasoftware.com"
            className="text-xs text-slate-700 hover:text-slate-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            uffdasoftware.com →
          </a>
        </p>
      </div>
    </div>
  )
}
