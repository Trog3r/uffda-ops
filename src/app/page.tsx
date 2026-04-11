import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Uffda Ops</h1>
          <p className="mt-1 text-sm text-neutral-500">Private operations dashboard</p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-xs text-neutral-600">
          <a
            href="https://uffdasoftware.com"
            className="hover:text-neutral-400 transition-colors"
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
