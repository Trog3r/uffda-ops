import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] px-4 relative overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #020617 100%)' }}
      />
      {/* Orange glow */}
      <div
        className="absolute pointer-events-none"
        style={{ top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo + wordmark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img
            src="/brand/web-app-manifest-192x192.png"
            alt="Uffda Ops"
            className="w-14 h-14 rounded-xl shadow-lg shadow-black/60"
          />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white tracking-tight">Uffda Ops</h1>
            <p className="text-xs text-slate-600 mt-0.5 uppercase tracking-widest">Private Dashboard</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#080f1d] p-5">
          <LoginForm />
        </div>

        <p className="mt-6 text-center">
          <a
            href="https://uffdasoftware.com"
            className="text-xs text-slate-700 hover:text-slate-500 transition-colors"
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
